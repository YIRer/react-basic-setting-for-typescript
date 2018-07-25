import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack'
import stats from '../build/react-loadable.json';

import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Helmet } from 'react-helmet';
import Handlebars from 'handlebars';
import _ from 'lodash';
import { getLoadableState } from 'loadable-components/server';
import { ServerStyleSheet } from 'styled-components';

import App from '../src/App';
import { matchRoutes } from 'react-router-config'
import { routes } from "../src/routes/index.async";
import template, { preload } from './template';
import manifest from '../build/asset-manifest.json'
import rootSaga from '../src/sagas/rootSaga';
import configureStore from '../src/configureStore.prod';
import { fbKey, cdnUrl } from './keys';


const path = require("path");
const fs = require("fs");
const extractAssets = (assets) => Object.keys(assets)
				.filter(asset => {
					// console.log(asset)
					return asset.indexOf('js') > -1 && asset.indexOf('.map')  < 0 ? asset.replace('.js', '') : null;
				})
				.map(k => {
					return assets[k].replace('static/','/')
				});

const extractAssetsCss = (assets) => Object.keys(assets)
			.filter(asset => {
				return asset.indexOf('css') > -1 && asset.indexOf('.map')  < 0 ? asset.replace('.css', '') : null;
			})
			.map(k => {
				return assets[k].replace('static/','/')
			});

	module.exports = async (req,res,) => {
		const filePath = path.resolve(__dirname,  '..', 'build/', 'index.hbs');
		fs.readFile(filePath, 'utf8', async (err, htmlData) => {
			const HandleHtml = Handlebars.compile(htmlData);
			try{
				const sheet = new ServerStyleSheet();
				const stylesComponents = sheet.getStyleTags();
			
				const branch = matchRoutes(routes,req.url);
				const modules = [];
				const location = branch[0].match.url;
				const store = configureStore();
				const context = {};
			
				const appWithRouter = (
					<Loadable.Capture report={m => modules.push(m)}>
						<StaticRouter location={req.url} context={context}>
							<Provider store={store}>
								<App/>
							</Provider>
						</StaticRouter>
					</Loadable.Capture>
					)
				if (context.status) {
					res.status(context.status);
				}
				store.runSaga(rootSaga).done.then(async ()=>{
						let bundles = getBundles(stats, modules);
	
						const content = ReactDOMServer.renderToString(appWithRouter);
						if(bundles[0].name.indexOf("Error") > 0){
							res.status(404);
						}
						const helmet = Helmet.renderStatic();
						const extraChunksCss = extractAssetsCss(manifest, modules);
						let chunks = '';

						const appJs = manifest["app.js"].replace('static/','/')
					
						const venderJS = manifest["vendor.js"].replace('static/','/')
						chunks += `<script src="${cdnUrl}${appJs}" defer ></script>`;
			
						chunks += `<script src="${cdnUrl}${venderJS}" defer ></script>`;
			
						_.forEach(bundles, chunk=>{
					
							const chunkUrl = chunk.file.replace('static/','/')
							chunks += `<script src="${cdnUrl}${chunkUrl}" defer ></script>`;
	
						});
		
						let chunksCss = `<link rel="stylesheet" href="${extraChunksCss.map((c,i)=>{
							return `${cdnUrl}${c}`;
						})}" >`;

						chunksCss += stylesComponents;
						const preloadedState = store.getState();
						const preloadHtml = preload(manifest, cdnUrl, bundles);
						return await res.send(template(HandleHtml, preloadHtml, helmet, content, chunks, chunksCss, preloadedState, fbKey));
				});

				const loadableState = await getLoadableState(appWithRouter);
				store.close()
		

			}catch(err){
				const errorDom = <div><p>Server Error</p></div>
				const errorRender = ReactDOMServer.renderToString(errorDom);
				return res.send(template(HandleHtml, null, null, errorRender, null, null, {}, fbKey));
			}
		})
}
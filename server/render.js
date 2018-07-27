import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack'
import stats from '../build/react-loadable.json';
import removeMarkDown from 'remove-markdown';

import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Helmet } from 'react-helmet';
import Handlebars from 'handlebars';
import _ from 'lodash';
import { getLoadableState } from 'loadable-components/server';
import { ServerStyleSheet } from 'styled-components';

import App from '../src/App';
import clearString from '../src/lib/clearString';
import { matchRoutes } from 'react-router-config'
import { routes } from "../src/routes/index.async";
import template, { preload } from './template';
import manifest from '../build/asset-manifest.json'
import rootSaga from '../src/sagas/rootSaga';
import configureStore from '../src/configureStore.prod';
import { fbKey, cdnUrl, setDefalutTitle, getTitle } from './keys';


const path = require("path");
const fs = require("fs");
const extractAssets = (assets) => Object.keys(assets)
				.filter(asset => {
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

const defaultTitle = setDefalutTitle(process.env.APP_LANGUAGE_ENV);

	module.exports = async (req,res) => {
		const filePath = path.resolve(__dirname,  '..', 'build/', 'index.hbs');

		fs.readFile(filePath, 'utf8', async (err, htmlData) => {
			const HandleHtml = Handlebars.compile(htmlData);
			try{
				const sheet = new ServerStyleSheet();
				const stylesComponents = sheet.getStyleTags();
				const branch = matchRoutes(routes,req.url);
				const modules = [];
				const location = branch[0].match.url;
				const checkPost = location.split('/')[1] === "post";
				const store = configureStore();
				const context = {};
				// console.log(req.url);
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
						if(bundles[0].name.indexOf("Error") > 0 || location === '/404'){
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
						const preloadedState =  await store.getState();
						const preloadHtml = preload(manifest, cdnUrl, bundles);
						// const loadTitle = getTitle(location, req.params.requestId, preloadedState, defaultTitle);
						// const preloadTitle = loadTitle.replace('\n','');
						// console.log(preloadTitle)
						let manifestJSON;
						if(checkPost){
							const postData = preloadedState.post.view;
							const removeMK = removeMarkDown(postData.content);
							const dataManifest = {
								'@context': 'http://schema.org',
								'@type': 'BlogPosting',
								author: {
									'@type': 'Person',
									name: postData.user.steem_account,
								},
								publisher: {
									'@type': 'Organization',
									name: `${req.headers.host}`,
									logo: {
										'@type': 'ImageObject',
										url: `https://static.tasteem.io/images/logo.png`,
										height: 32,
										width: 32,
									},
								},
								url:`https://${req.headers.host}${req.url}`,
								mainEntityOfPage: `https://${req.headers.host}/`,
								headline: postData.title,
								articleBody:clearString(removeMK),
								image: postData.title_image.content.url || `https://static.tasteem.io/images/logo.png`,
								datePublished: postData.created_at,
								dateModified: postData.event.updated_at,
							};
							manifestJSON = JSON.stringify(dataManifest);
						}else if(req.url === "/"){
							const dataManifest = {
								"@context": "http://schema.org",
								"@type": "Organization",
								"url": `https://${req.headers.host}/`,
								"logo": "https://static.tasteem.io/images/logo.png"
							}
							manifestJSON = JSON.stringify(dataManifest);
						}
						return await res.send(template(HandleHtml, preloadHtml, helmet, content, chunks, chunksCss, preloadedState, fbKey, manifestJSON, defaultTitle));
				}).catch(err=>{
					// console.log(err);
					return res.redirect(302, req.baseUrl + '/404');
				})
				const loadableState = await getLoadableState(appWithRouter);
				store.close()
			}catch(err){
				// console.log(err);
				return res.redirect(302, req.baseUrl + '/404');	
			}
		})
}
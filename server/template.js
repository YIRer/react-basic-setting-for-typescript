import _ from 'lodash';
export default (htmlData, preloadAsset, helmetData, html, chunks, chunksCss, preloadedStoreState, fbKey) => {
	const preloadedState = _.isNil(preloadedStoreState) ? null : `<script>window.__PRELOADED_STATE__ = ${JSON.stringify (preloadedStoreState).replace(/\u2028/g, '\\n')
	.replace(/</g, '\\u003c')};</script>`;
	const helmet =   _.isNil(helmetData) ? null : `${helmetData.title.toString()}${helmetData.meta.toString()}${helmetData.link.toString()}`;
	const production = process.env.NODE_ENV === 'production';
	return htmlData({
		helmet,
		preloadAsset,
		chunksCss,
		production,
		html,
		chunks,
		preloadedState,
		fbKey
	})	
}

export function preload(assets,cdnUrl,bundles){
	const appCss = assets["app.css"].replace("static/","/");
	const appJs = assets["app.js"].replace("static/","/");
	const venderJS = assets["vendor.js"].replace("static/","/");

	let chunks ="";

	_.forEach(bundles, c=>{
		const chunkUrl = c.file.replace('static/','/')
		chunks += `	<link rel="preload" as="script" href="${cdnUrl}${chunkUrl}">`;
	});
	
	let preLoads =`<link rel="preconnect" href="https://static.tasteem.io/images/">`; 
	preLoads += `<link rel="preload" as="style" href="${cdnUrl}${appCss}">`;
	preLoads += `<link rel="preload" as="script" href="${cdnUrl}${appJs}">`;
	preLoads += `<link rel="preload" as="script" href="${cdnUrl}${venderJS}">`
	preLoads += chunks;
	return preLoads;
}

export function stringHTML (htmlData, html, helmet, extraChunks, preloadedState, loadableState, fbKey, preload) {
	return htmlData
  .replace(`<html>`,`<html ${helmet.htmlAttributes.toString()} itemscope>`)
  .replace(`<head>`,`${preload}`)
	.replace('</body>',  `</body>
		${extraChunks}
		<script>window.__PRELOADED_STATE__ = ${JSON.stringify (preloadedState)};</script>
				${loadableState.getScriptTag()}
				<script>
					window.fbAsyncInit = function() {
						FB.init({
							appId      : '${fbKey}',
							xfbml      : true,
							version    : 'v2.12'
						});
					
						FB.AppEvents.logPageView();
					
					};
				
					(function(d, s, id){
						var js, fjs = d.getElementsByTagName(s)[0];
						if (d.getElementById(id)) {return;}
						js = d.createElement(s); js.id = id;
						js.src = "https://connect.facebook.net/en_US/sdk.js";
						fjs.parentNode.insertBefore(js, fjs);
					}(document, 'script', 'facebook-jssdk'));
			</script>
	`)
  .replace('<meta helmet>', `${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}`)
  .replace('<div id="root"></div>', 
    `
      <div id="root">${html}</div>
    `
  )
}
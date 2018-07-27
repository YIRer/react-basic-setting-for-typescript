import express from 'express';
// import Loadable from 'react-loadable';
import render from './render';

const path = require("path");
const compression = require("compression");
// const httpsRedirect = require('express-https-redirect');

const PORT = process.env.PORT || 8080;
const app = express();
const router = express.Router();

app.use(compression({level: 9}));

// app.all('*',(req,res,next)=>{
//   res.header("Access-Control-Allow-Origin", "*");
// 	res.header("Access-Control-Allow-Headers", "X-Requested-With");
// 	next();
// })

app.get('*.*', express.static(path.resolve(__dirname, '..', 'build'),{ maxAge: 3600000 }));
// app.use('/healthcheck', require('express-healthcheck')());
// app.use('/', httpsRedirect());
router.get('/', render);
router.use(express.static(
	path.resolve(__dirname, '..', 'build'),
  { maxAge: 3600000 }
));

router.get('*', render);

app.use(router);

app.listen(PORT, (error) => {
	if (error) {
		return console.log('something bad happened', error);
	}
	console.log("listening on " + PORT + "...");
});
// Loadable.preloadAll().then(() => {

// });

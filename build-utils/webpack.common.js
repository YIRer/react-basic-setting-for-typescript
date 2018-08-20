const commonPaths = require('./common-paths');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const config = {
  //앱의 진입점. 기본값은 ./src
  entry: {
    // 특정 라이브러리를 빼내서 vendor로 이동
    vendor: ['lodash']
  },
  output: {
    //컴파일된 파일이 저장되는 경로
    path: commonPaths.outputPath,
    publicPath: '/'
  },
  performance: { hints: false },
  module: {
    // node_modules를 제외한 곳에서 js 확장자를 찾아서 .babelrc에 정의 된 대로 자바스크립트 컴파일
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  //vendor로 분할한 뒤, 번들 용량을 줄이기 위해 설정
  optimization: {
    splitChunks: {
      chunks: 'initial',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor'
        }
      }
    },
    runtimeChunk: {
      name: 'manifest',
    },
  },
  plugins: [
    new WebpackBar(),
    //기본 템플릿 파일 설정
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      favicon: 'public/favicon.ico'
    }),
    new UglifyJsPlugin(
      {
        uglifyOptions:{
          compress:{
            warnings:false
          },
          sourceMap:true
        }
      }
    ),
  ]
};
module.exports = config;
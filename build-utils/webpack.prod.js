const webpack = require('webpack');
const commonPaths = require('./common-paths');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const config = {
  mode: 'production',
  entry: {
    app: [`${commonPaths.appEntry}/index.js`],
  },
  output: {
    filename: 'static/[name].[hash].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          //css가 따로 추출되지 않으면 loader실행
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                //@import(ed) 리소스에 css-loader를 적용하기전 로더를 구성
                importLoaders: 1,
                camelCase: true
              },
            },
            {
              //css-loader 전에 PostCSS가 실행되어 압축하고, css룰 적용 및 자동 전처리 실행
              loader: 'postcss-loader',
              options: {
                config: {
                  ctx: {
                    autoprefixer: {
                      browsers: 'last 2 versions',
                    },
                  },
                },
              },
            },
          ],
        }),
      },
    ],
  },
  plugins: [
    //사용된 에셋들을 정리해둔 json파일 생성
    new AssetsPlugin({
      path: commonPaths.outputPath,
      filename: 'assets.json',
    }),
    //styles 디렉터리 내 스타일시트를 생성
    new ExtractTextPlugin({
      filename: 'styles/styles.[hash].css',
      allChunks: true,
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new LodashModuleReplacementPlugin({
      collections: true,
      paths: true,
      shorthands: true,
      flattening: true,
    }),
  ],
};
module.exports = config;

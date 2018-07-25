const commonPaths = require('./common-paths');
const webpack = require('webpack');
const port = process.env.PORT || 3000;
const config = {
  //개발 모드 설정
  mode: 'development',
  entry: {
    app: `${commonPaths.appEntry}/index.js`
  },
  output: {
    // 저장되는 파일의 이름 설정 [hash]로 해시를 이름을 지정가능, 경로기준으로 코드 분할
    filename: '[name].[hash].js'
  },
  //개발시 사용되는 소스맵 설정
  devtool: 'inline-source-map',
  // 사용되는 모듈 정의
  module: {
    //각 모듈이 처리하는 방법 정의
    rules: [
      //css 모듈, 카멜케이스, 소스맵 사용
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              camelCase: true,
              sourceMap: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    //HMR 설정
    new webpack.HotModuleReplacementPlugin()
  ],
  //개발서버 설정
  devServer: {
    host: 'localhost',
    port: port,
    historyApiFallback: true,
    hot: true,
    open: true
  }
};
module.exports = config;
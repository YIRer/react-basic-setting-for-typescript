# Setting Package

### 리액트 패키지 설치
`yarn add react react-dom react-prop-types react-router-dom semantic-ui-react` 
### 개발에서 사용되는 패키지 설치
`yarn add babel-core babel-loader babel-preset-env babel-preset-react babel-preset-stage-1 css-loader style-loader html-webpack-plugin webpack webpack-dev-server webpack-cli -D`

#### 설치된 패키지 설명

* react : 리액트
* react-dom : 브라우저 DOM 메서드 사용
* react-prop-types: React props 타입 체크
* react-router-dom : 브라우저에서 동작하는 리액트 라우트 설정을 위한 라이브러리
* sementic-ui-react : css프레임 워크
* babel-core: Babel 핵심 의존성 라이브러리 ES6 -> ES5로
* babel-loader : 바벨과 웹팩으로 자바스크립트 컴파일
* babel-preset-env: 버전 지정을 하지 않아도 자동으로 컴파일
* babel-preset-stage-1: Stage-1 스펙을 기준으로 작업
* babel-preset-react: 리액트를 사용하는 것을 바벨에 알리는 역할
* css-loader: import, url을 해석해서 사용가능
* html-webpaack-plugin: 앱을 위한 HTML파일을 생성하거ㅏ 템플릿을 제공
* style-loader: `<style>` 태그를 삽입하여 CSS를 추가
* webpack : 모듈 번들러
* webpack-cli: 4.0.1 이상에서 필요한 커맨드라인 인터페이스
* webpack-dev-server: 애플리케이션 개발 서버

### babel 설정

최상위 디렉터리에 `.babrlrc` 파일을 생성 후 preset설정
>{
>   "presets": ["env","react","stage-1"]  
>}


### Hot-Module-Replace 설정

#### 설치

`yarn add react-hot-loader -D`

`.babelrc`에 플러그인 설정 추가

> "plugins" : ["react-hot-loader/babel"]

### 코드 스플릿팅

`yarn add react-imported-component react-delay-render`

### 배포를 위한 설정

#### 앤트리 청크에서 사용되는 css를 인라인으로 로드하기 위한 플러그인

`yarn add extract-text-webpack-plugin@next -D`

`postcss.config.js` 생성 후 autoprefixer 설정

>module.exports = {
>  plugins: [require('autoprefixer')]
>};

#### 이전 빌드 파일 삭제 및 유연한 환경 적용

`yarn add rimraf cross-env -D`

#### 명령어 추가

`package.json`에 명령어 영역 추가

>  "scripts": {
>    "dev": "webpack-dev-server --env.env=dev"
>    "prebuild": "rimraf dist",
>    "build": "cross-env NODE_ENV=production webpack -p --env.env=prod"
>  },


### 추가 웹팩 설정

* common-paths.js : 공통으로 사용되는 경로 정의
* build-validations.js : `-env.env` 플래그가 없으면 작동되지 않게 하기

#### 웹팩 번들 분석기

`yarn add webpack-bundle-analyzer -D`

`webpack.bundleanalyzer.js` 설정

>const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
>  .BundleAnalyzerPlugin;
>
>module.exports = {
>  plugins: [
>    new BundleAnalyzerPlugin({
>      analyzerMode: 'server'
>    })
>  ]
>};

스크립트에 명령어 추가

> "dev:bundleanalyzer": "yarn dev --env.addons=bundleanalyzer",
> "build:bundleanalyzer": "yarn build --env.addons=bundleanalyzer"

### Reference

[http://sujinlee.me/webpack-react-tutorial/](http://sujinlee.me/webpack-react-tutorial/)
'use strict';

let path = require('path');
let webpack = require('webpack');
let baseConfig = require('./base');
let defaultSettings = require('./defaults');

// Add needed plugins here
let BowerWebpackPlugin = require('bower-webpack-plugin');

let config = Object.assign({}, baseConfig, {
  entry: [
    'webpack-dev-server/client?http://127.0.0.1:' + defaultSettings.port,
    'webpack/hot/only-dev-server', //热更新相关的文件
    './src/index'
  ],
  cache: false, //默认值true，webpack会缓存生成的模块和代码块，以便实现多次增量编译，集中性的。因为最终只编译一次，没必要使用cache
  devtool: 'eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(), //本地开发调试的热更新
    new webpack.NoErrorsPlugin(),
    new BowerWebpackPlugin({
      searchResolveModulesDirectories: false
    })
  ],
  module: defaultSettings.getDefaultModules()
});

// Add needed loaders to the defaults here
config.module.loaders.push({
  test: /\.(js|jsx)$/,
  loader: 'react-hot!babel-loader',
  include: [].concat(
    config.additionalPaths,
    [ path.join(__dirname, '/../src') ]
  )
});

module.exports = config;

//__dirname：当前执行脚本所在目录
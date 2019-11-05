const Dotenv = require('dotenv-webpack');
const merge = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: "source-map",
  devServer: {
    contentBase: __dirname + './dist',
    //publicPath: '/',
    hot: true,
    disableHostCheck: true,
    historyApiFallback: true
  },
  output: {
    filename: 'bundle.js',
    path: __dirname + './dist',
    publicPath: '/'
  },
  plugins: [
    new Dotenv({ path: './.env.test'})
  ]
});
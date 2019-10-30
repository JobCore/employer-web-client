const Dotenv = require('dotenv-webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
  mode: 'development',
  devtool: "source-map",
  devServer: {
    contentBase: '.' + path.sep + 'dist',
    hot: true,
    disableHostCheck: true,
    historyApiFallback: true
  },
  plugins: [
    new Dotenv({path: '.' + path.sep + '.env.dev'})
  ]
});

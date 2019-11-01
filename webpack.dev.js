const Dotenv = require('dotenv-webpack');
const merge = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: "source-map",
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    hot: true,
    disableHostCheck: true,
    historyApiFallback: true
  },
  plugins: [
    new Dotenv({ path: './.env.dev'})
  ]
});

const Dotenv = require('dotenv-webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    splitChunks: {
        cacheGroups: {
            vendor: {
                test: /node_modules/, // you may add "vendor.js" here if you want to
                name: "vendor",
                chunks: "initial",
                enforce: true
            }
        }
    }
  },
  plugins: [
    new Dotenv({ path: './.env.prod'})
  ]
});
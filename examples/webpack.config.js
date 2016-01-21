var webpack = require('webpack');
var path = require('path');

var isDebug = process.env.NODE_ENV !== 'production';

module.exports = {
  watch: isDebug,

  entry: './index.js',

  devtool: isDebug ? 'inline-source-map' : 'source-map',

  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'build')
  },

  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel'
    }]
  },

  plugins: isDebug ? [] : [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
      },
    })
  ]
};

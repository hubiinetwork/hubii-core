/**
 * ELECTRON WEBPACK CONFIGURATION
 */
require('dotenv').config();
const fs = require('fs')
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');

// Remove this line once the following warning goes away (it was meant for webpack loader authors not users):
// 'DeprecationWarning: loaderUtils.parseQuery() received a non-string value which can be problematic,
// see https://github.com/webpack/loader-utils/issues/56 parseQuery() will be replaced with getOptions()
// in the next major version of loader-utils.'
process.noDeprecation = true;

// Expose APIs for the environment targeted
const target = 'node';

var node_modules = {}
var node_modules_2 = {}

fs.readdirSync('node_modules').forEach(function(module) {
  node_modules[module] = "require('"+module+"')"
  node_modules_2[module] = module
})

const commonConfig = {
  mode: 'development',
  entry: {
    electron: path.join(process.cwd(), 'public/electron.js'),
    preload: path.join(process.cwd(), 'public/preload.js'),
  },
  output: {
    path: path.resolve(process.cwd(), 'build'),
    filename: 'public/[name].js',
    chunkFilename: '[name].chunk.js',
  },
  optimization: {
    minimize: false,
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          // options: options.babelQuery,
        },
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': Object.keys(process.env).reduce((accumulator, currentKey) => {
        const envs = accumulator;
        envs[currentKey] = JSON.stringify(process.env[currentKey]);
        return envs;
      }, {}),
    }),
    new CircularDependencyPlugin({
      exclude: /a\.js|node_modules/, // exclude node_modules
      failOnError: false, // show a warning when there is a circular dependency
    }),
    new CopyWebpackPlugin(
      [
        { from: 'public/', to: 'public/' },
      ]
    ),
  ],
  resolve: {
    modules: [
      'node_modules',
      'src',
    ],
    extensions: [
      '.js',
    ],
    mainFields: [
      'browser',
      'jsnext:main',
      'main',
    ],
  },
  devtool: 'eval-source-map',
  externals: node_modules,
  target,
  node: {
    __dirname: false,
    __filename: false,
  },
}

module.exports = (options) => ([
  commonConfig, 
  {
    ...commonConfig,
    entry: {
      "wallets/lns/index": path.join(process.cwd(), 'public/wallets/lns/index.js'),
    },
    externals: node_modules_2,
    output: {
      path: path.resolve(process.cwd(), 'build'),
      filename: 'public/[name].js',
      chunkFilename: '[name].chunk.js',
      libraryTarget: 'commonjs2',
    },
  }
]);

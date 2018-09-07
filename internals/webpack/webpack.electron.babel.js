/**
 * COMMON WEBPACK CONFIGURATION
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
fs.readdirSync('node_modules').forEach(function(module) {
  node_modules[module] = "require('"+module+"')"
})


module.exports = (options) => ({
  mode: 'development',
  entry: [
    path.join(process.cwd(), 'public/electron.js'),
  ],
  output: {
    path: path.resolve(process.cwd(), 'build'),
    // publicPath: 'public',
    filename: 'public/electron.js',
    chunkFilename: '[name].chunk.js',
  },
  optimization: {
    minimize: false,
  },
  // module: {
  //   rules: [
  //     {
  //       test: /\.js?$/,
  //       exclude: /node_modules/,
  //       use: {
  //         loader: 'babel-loader',
  //         // options: options.babelQuery,
  //       },
  //     }
  //   ]
  // },
  plugins: [
    // new webpack.ProvidePlugin({
    //   // make fetch available
    //   fetch: 'exports-loader?self.fetch!whatwg-fetch',
    // }),

    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; UglifyJS will automatically
    // drop any unreachable code.
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
      '.jsx',
      '.react.js',
      '.css',
      '.less',
      '.json',
    ],
    mainFields: [
      'browser',
      'jsnext:main',
      'main',
    ],
    // alias: {
    //   moment$: 'moment/moment.js',
    // },
  },
  devtool: 'eval-source-map',
  externals: node_modules,
  target,
  node: {
    __dirname: false,
    __filename: false,
  },
//   node,
  performance:  {},
});

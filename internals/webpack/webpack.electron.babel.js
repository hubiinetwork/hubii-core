/**
 * ELECTRON WEBPACK CONFIGURATION
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const CircularDependencyPlugin = require('circular-dependency-plugin');

// Remove this line once the following warning goes away (it was meant for webpack loader authors not users):
// 'DeprecationWarning: loaderUtils.parseQuery() received a non-string value which can be problematic,
// see https://github.com/webpack/loader-utils/issues/56 parseQuery() will be replaced with getOptions()
// in the next major version of loader-utils.'
process.noDeprecation = true;

// Expose APIs for the environment targeted

const nodeModules = {};
const nodeModulesCommonjs2 = {};

fs.readdirSync('node_modules').forEach((module) => {
  nodeModules[module] = `require('${module}')`;
  nodeModulesCommonjs2[module] = module;
});

const commonConfig = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: {
    electron: path.join(process.cwd(), 'src/electron/electron.js'),
    preload: path.join(process.cwd(), 'src/electron/preload.js'),
  },
  output: {
    path: path.resolve(process.cwd(), 'build'),
    filename: 'electron/[name].js',
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
        include: /src/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
    ],
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
  ],
  resolve: {
    modules: [
      'node_modules',
      'src',
    ],
    extensions: [
      '.js',
      '.html',
    ],
    mainFields: [
      'browser',
      'jsnext:main',
      'main',
    ],
  },
  devtool: 'eval-source-map',
  externals: nodeModules,
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
};

module.exports = () => ([
  commonConfig,
  {
    ...commonConfig,
    entry: {
      // transpile the dynamic requires
      'wallets/lns/index': path.join(process.cwd(), 'src/electron/wallets/lns/index.js'),
    },
    externals: nodeModulesCommonjs2,
    output: {
      path: path.resolve(process.cwd(), 'build'),
      filename: 'electron/[name].js',
      chunkFilename: '[name].chunk.js',
      libraryTarget: 'commonjs2',
    },
  },
]);

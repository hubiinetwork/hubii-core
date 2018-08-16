// Important modules this config uses
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = require('./webpack.base.babel')({
  mode: 'production',

  // In production, we skip all hot-reloading stuff
  entry: [
    path.join(process.cwd(), 'node_modules/antd/dist/antd.css'),
    path.join(process.cwd(), 'node_modules/sanitize.css/sanitize.css'),
    path.join(process.cwd(), 'src/app.js'),
  ],

  // Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
  output: {
    publicPath: '',
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
  },

  optimization: {
    minimize: false,
  },

  plugins: [
    // Minify and optimize the index.html
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: true,
    }),
  ],

  performance: {
    assetFilter: (assetFilename) => !(/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename)),
  },
});

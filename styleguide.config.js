const path = require('path');
const webpackConfig = require('./internals/webpack/webpack.dev.babel.js');

module.exports = {
  components: 'src/components/**/[A-Z]*.component.js',
  styleguideComponents: {
    Wrapper: path.join(__dirname, 'src/themes/Wrapper.js'),
  },
  require: ['antd/dist/antd.css', path.join(__dirname, 'public/index.css')],
  webpackConfig,
};

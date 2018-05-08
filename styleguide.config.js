const path = require('path');

module.exports = {
  components: 'src/components/**/[A-Z]*.component.js',
  styleguideComponents: {
    Wrapper: path.join(__dirname, 'src/themes/Wrapper.js')
  },
  require: ['antd/dist/antd.css']
};

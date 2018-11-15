
const fs = require('fs-extra');
const buildDir = './build';

if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir);
}

try {
  fs.copySync('./public', './build/public');
} catch (e) {
  console.log(e);
}

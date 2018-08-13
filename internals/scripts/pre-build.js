
const fs = require('fs-extra');
const buildDir = './build';
const icons = ['icon.icns', 'icon.ico', 'icon.png'];

try {
  // empty build folder
  fs.removeSync(buildDir);
  fs.mkdirSync(buildDir);

  // copy icons into build folder
  icons.forEach((fileName) => {
    fs.copyFileSync(`./public/icons/${fileName}`, `./build/${fileName}`);
  });
} catch (e) {
  console.error(e); // eslint-disable-line no-console
}

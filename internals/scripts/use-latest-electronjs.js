
const fs = require('fs');
const buildDir = './build/public';
const buildPublicDir = './build/public';

if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir);
}

if (!fs.existsSync(buildPublicDir)) {
  fs.mkdirSync(buildPublicDir);
}

fs.copyFileSync('./public/electron.js', './build/public/electron.js', (e) => {
  if (e) throw e;
});

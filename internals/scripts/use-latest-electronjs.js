
const fs = require('fs-extra');
const buildDir = './build/public';
const buildPublicDir = './build/public';

if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir);
}

if (!fs.existsSync(buildPublicDir)) {
  fs.mkdirSync(buildPublicDir);
}

const sources = [
  'public/electron.js',
  'public/wallets',
]

try {
  sources.forEach(path => {
    fs.copySync(`./${path}`, `./build/${path}`)
  })
}catch(e) {
  console.log(e)
}

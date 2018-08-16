require('./wallets/preload');
const isDev = require('electron-is-dev');
const errorReporter = require('./error-reporter');

if (!isDev) {
  errorReporter();
}

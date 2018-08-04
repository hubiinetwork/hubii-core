const { webFrame } = require ('electron');

if (webFrame) {
  webFrame.registerURLSchemeAsPrivileged('wallet');
}
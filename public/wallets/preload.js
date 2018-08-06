const { webFrame } = require('electron');
const { protocolNames } = require('./handlers');

if (webFrame) {
  protocolNames.forEach((name) => {
    const PROTOCOL_NAME = name;
    webFrame.registerURLSchemeAsPrivileged(PROTOCOL_NAME);
  });
}

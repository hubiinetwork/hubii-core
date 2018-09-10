const trezorHandler = require('./trezor');
const lnsHandler = require('./lns');
const path = require('path')
const protocolNames = [trezorHandler.PROTOCOL_NAME, lnsHandler.PROTOCOL_NAME];
const loadHandlers = async () => {
  // eslint-disable-next-line global-require
  const lnsHandlerModule = (await require('electron-remote').rendererRequireDirect(path.join(require('electron').app.getAppPath(), 'build/electron/wallets/lns/index.js'))).module;
  const handlers = {
    trezor: trezorHandler,
    lns: lnsHandlerModule,
  };
  return handlers;
};

module.exports = {
  loadHandlers,
  protocolNames,
};

import * as trezorHandler from './trezor';
import * as lnsHandler from './lns';
import path from 'path'
export const protocolNames = [trezorHandler.PROTOCOL_NAME, lnsHandler.PROTOCOL_NAME];
export const loadHandlers = async () => {
  // eslint-disable-next-line global-require
  const lnsHandlerModule = (await require('electron-remote').rendererRequireDirect(path.join(require('electron').app.getAppPath(), 'build/electron/wallets/lns/index.js'))).module;
  const handlers = {
    trezor: trezorHandler,
    lns: lnsHandlerModule,
  };
  return handlers;
};
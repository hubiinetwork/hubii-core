import 'babel-polyfill';
import { remote } from 'electron';
import LedgerTransport from '@ledgerhq/hw-transport-node-hid';
import Eth from '@ledgerhq/hw-app-eth';

function emitEvent(windowInstance, event) {
  windowInstance.webContents.send('lns-status', event);
}

export const deviceEventListener = function() {
  const mainWindow = remote.getGlobal('mainWindow');
  const sub = LedgerTransport.listen({
    next: (e) => emitEvent(mainWindow, e),
    error: (e) => emitEvent(mainWindow, e),
    complete: (e) => emitEvent(mainWindow, e),
  });

  process.on('exit', () => {
    sub.unsubscribe();
  });
}

export const execWalletMethods = async function(method, params) {
  const { id, path } = params;
  let result;

  if (method === 'getaddress') {
    result = await createEthTransportActivity(id, (ethTransport) => ethTransport.getAddress(path));
  }
  if (method === 'getpublickey') {
    result = await createEthTransportActivity(id, (ethTransport) => ethTransport.getAddress(path, false, true));
  }
  if (method === 'signtx') {
    const { rawTxHex } = params;
    result = await createEthTransportActivity(id, (ethTransport) => ethTransport.signTransaction(path, rawTxHex));
  }
  if (method === 'signpersonalmessage') {
    const { message } = params;
    result = await createEthTransportActivity(id, (ethTransport) => ethTransport.signPersonalMessage(path, message));
  }

  if (result) {
    return { ...result, id, path };
  }
  return null;
}

const createEthTransportActivity = async (descriptor, activityFn) => {
  let transport;
  try {
    if (process.platform === 'win32') {
      transport = await LedgerTransport.create();
    } else {
      transport = await LedgerTransport.open(descriptor);
    }
    const ethTransport = new Eth(transport);
    const result = await activityFn(ethTransport);
    return result;
  } finally {
    if (transport) {
      await transport.close();
    }
  }
};

export const PROTOCOL_NAME = 'lns';

import { remote } from 'electron';
import { utils } from 'ethers';
import LedgerTransport from '@ledgerhq/hw-transport-node-hid';
import Eth from '@ledgerhq/hw-app-eth';

function emitEvent(windowInstance, event) {
  windowInstance.webContents.send('lns-status', event);
}

export function deviceEventListener() {
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

export async function execWalletMethods(method, params) {
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

export const nahmiiSdkSignMessage = async (_message) => {
  const transport = await LedgerTransport.create();
  const eth = new Eth(transport);

  let message = _message;
  if (typeof message === 'string') {
    message = utils.toUtf8Bytes(_message);
  }
  const messageHex = utils.hexlify(message).substring(2);
  return eth.signPersonalMessage("m/44'/60'/0'/0", messageHex).then((_signature) => {
    const signature = { ..._signature };
    signature.r = `0x${signature.r}`;
    signature.s = `0x${signature.s}`;
    return utils.joinSignature(signature);
  });
};

export const nahmiiSdkSignTransaction = async (unresolvedTx) => {
  const transport = await LedgerTransport.create();
  const eth = new Eth(transport);

  const tx = await utils.resolveProperties(unresolvedTx);
  const serializedTx = utils.serializeTransaction(tx);
  const sig = await eth.signTransaction("m/44'/60'/0'/0", serializedTx.substring(2));
  sig.r = `0x${sig.r}`;
  sig.s = `0x${sig.s}`;
  return utils.serializeTransaction(tx, sig);
};

export const PROTOCOL_NAME = 'lns';

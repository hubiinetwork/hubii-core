const { DeviceList } = require('trezor.js');
const showPrompt = require('./showPrompt');

const PROTOCOL_NAME = 'trezor';

const devices = {};

function deviceEventListener(mainWindow) {
  const deviceList = new DeviceList({ debug: false });
  deviceList.on('connect', (device) => {
    const deviceId = device.features.device_id;
    devices[deviceId] = device;
    device.on('pin', (_, cb) => {
      showPrompt('pin')
        .then((pin) => {
          cb(undefined, pin);
        })
        .catch((err) => {
          cb(err);
        });
    });

    let passphraseCache;
    device.on('passphrase', (cb) => {
      if (passphraseCache) {
        cb(undefined, passphraseCache);
      } else {
        showPrompt('passphrase')
          .then((passphrase) => {
            cb(undefined, passphrase);
            // cache passphrase for immediate subsequence calls to trezor
            passphraseCache = passphrase;
            setTimeout(() => {
              passphraseCache = null;
            }, 5000);
          })
          .catch((err) => {
            cb(err);
          });
      }
    });

    // For convenience, device emits 'disconnect' event on disconnection.
    device.on('disconnect', () => {
      delete devices[deviceId];
      mainWindow.webContents.send('status', { deviceId, status: 'disconnected' });
    });
    mainWindow.webContents.send('status', { deviceId, status: 'connected' });
  });

  process.on('exit', () => {
    deviceList.onbeforeunload();
  });
}

async function execWalletMethods(method, params, cb) {
  const { id, path } = params;

  await devices[id].waitForSessionAndRun(async (session) => {
    if (method === 'getaddress') {
      const result = await session.ethereumGetAddress(
        parseHDPath(path)
      , false);
      cb(JSON.stringify({ path, address: result.message.address }));
    }
    if (method === 'signtx') {
      const { tx } = params;
      const signedTx = await session.signEthTx(
        parseHDPath(path),
        tx.nonce,
        tx.gasPrice,
        tx.gasLimit,
        tx.toAddress,
        tx.value,
        tx.data,
        tx.chainId
      );
      cb(JSON.stringify(signedTx));
    }
    if (method === 'getpublickey') {
      const { message } = await session.getPublicKey(parseHDPath(path));
      cb(JSON.stringify(message));
    }
  });
}

function parseHDPath(path) {
  return path
    .toLowerCase()
    .split('/')
    .filter((p) => p !== 'm')
    .map((p) => {
      let hardened = false;
      let n = parseInt(p, 10);
      if (p[p.length - 1] === "'") {
        hardened = true;
        // eslint-disable-next-line no-param-reassign
        p = p.substr(0, p.length - 1);
      }
      if (isNaN(n)) {
        throw new Error('Invalid path specified');
      }
      if (hardened) {
        // eslint-disable-next-line no-bitwise
        n = (n | 0x80000000) >>> 0;
      }
      return n;
    });
}

module.exports = {
  PROTOCOL_NAME,
  deviceEventListener,
  execWalletMethods,
};

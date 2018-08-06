const {DeviceList} = require('trezor.js')
const showPrompt = require('./showPrompt')

const PROTOCOL_NAME = 'trezor'

const devices = {}

function deviceEventListener (mainWindow) {
  const deviceList = new DeviceList({debug: false});
  console.log('device event listener')
  deviceList.on('connect', function (device) {
    const deviceId = device.features.device_id
    devices[deviceId] = device
    console.log("Connected device " + device.features.label);
    device.on('pin', (_, cb) => {
      showPrompt('pin')
        .then(pin => {
          cb(undefined, pin);
        })
        .catch(err => {
          console.error('PIN entry failed', err);
          cb(err);
        });
    });

    let passphraseCache
    device.on('passphrase', (cb) => {
      if (passphraseCache) {
        return cb(undefined, passphraseCache)
      }
      
      showPrompt('passphrase')
        .then(passphrase => {
          cb(undefined, passphrase);
          //cache passphrase for immediate subsequence calls to trezor
          passphraseCache = passphrase
          setTimeout(() => {
            passphraseCache = null
          }, 5000)
        })
        .catch(err => {
          console.error('Passphrase entry failed', err);
          cb(err);
        });
      
    });

    // For convenience, device emits 'disconnect' event on disconnection.
    device.on('disconnect', function () {
      delete devices[deviceId]
      mainWindow.webContents.send ('status', {deviceId, status:'disconnected'});
    });
    mainWindow.webContents.send ('status', {deviceId, status:'connected'});
  })

  process.on('exit', function() {
    deviceList.onbeforeunload();
  });
}

async function listenWalletMethods(method, params, cb) {
  const {id, path} = params
  await devices[id].waitForSessionAndRun(function (session) {
    if (method === 'getaddress') {
      return session.ethereumGetAddress(
        parseHDPath(path)
      , false)
      .then(function (result) {
        cb(JSON.stringify({path: path, address: result.message.address}));
      })
    }
    if (method === 'signtx') {
      const {tx} = params
      console.log('signtx', path, tx)
      return session.signEthTx(
        parseHDPath(path),
        tx.nonce,
        tx.gasPrice,
        tx.gasLimit,
        tx.toAddress,
        tx.value,
        tx.data,
        tx.chainId
      ).then(signedTx => {
        console.log('signed tx', signedTx)
        cb(JSON.stringify(signedTx));
      })
    }
  })
}

function parseHDPath(path) {
  return path
    .toLowerCase()
    .split('/')
    .filter(p => p !== 'm')
    .map(p => {
      let hardened = false;
      let n = parseInt(p, 10);
      if (p[p.length - 1] === "'") {
        hardened = true;
        p = p.substr(0, p.length - 1);
      }
      if (isNaN(n)) {
        throw new Error('Invalid path specified');
      }
      if (hardened) {
        // hardened index
        n = (n | 0x80000000) >>> 0;
      }
      return n;
    });
}

module.exports = {
  PROTOCOL_NAME: PROTOCOL_NAME,
  deviceEventListener: deviceEventListener,
  listenWalletMethods: listenWalletMethods,
}
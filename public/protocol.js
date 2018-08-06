const { protocol, BrowserWindow } = require('electron');
const {DeviceList} = require('trezor.js')

const showPinPrompt = require('./trezor/showPinPrompt')

const PROTOCOL_NAME = 'wallet'
protocol.registerStandardSchemes([PROTOCOL_NAME]);

const devices = {}
async function listenHardwareWallets (mainWindow) {
  var deviceList = new DeviceList({debug: false});
  deviceList.on('connect', function (device) {
    const deviceId = device.features.device_id
    devices[deviceId] = device
    console.log("Connected device " + device.features.label);
    // What to do on user interactions:
    device.on('pin', (_, cb) => {
      showPinPrompt()
        .then(pin => {
          cb(undefined, pin);
        })
        .catch(err => {
          console.error('PIN entry failed', err);
          cb(err);
        });
    });

    // For convenience, device emits 'disconnect' event on disconnection.
    device.on('disconnect', function () {
      console.log('Disconnected an opened device');
      delete devices[deviceId]
      mainWindow.webContents.send ('status', {deviceId, status:'disconnected'});
    });
    mainWindow.webContents.send ('status', {deviceId, status:'connected'});
  })

  process.on('exit', function() {
    deviceList.onbeforeunload();
  });
}

function getMethod(req) {
  const urlSplit = req.url.split(`${PROTOCOL_NAME}://`);

  if (!urlSplit[1]) {
    throw new Error('No method provided');
  }

  const method = urlSplit[1].replace('/', '');

  return method;
}

function getParams(method, req) {
  const data = req.uploadData.find(d => !!d.bytes);

  if (!data) {
    throw new Error(`No data provided for '${method}'`);
  }

  try {
    // TODO: Validate params based on provided method
    const params = JSON.parse(data.bytes.toString());
    return params
  } catch (err) {
    throw new Error(`Invalid JSON blob provided for '${method}': ${err.message}`);
  }
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

function listenHardwareWalletMethods() {
  protocol.registerStringProtocol(PROTOCOL_NAME, async (req, cb) => {
    let res;
    try {
      const method = getMethod(req);
      const params = getParams(method, req);
      console.log('api', method, params)
      const {id, path} = params
      // const data = await handlers[method](params);
      await devices[id].waitForSessionAndRun(function (session) {
        if (method === 'getaddress') {
          // const hardeningConstant = 0x80000000;
          // const pathArray = path.replace("'").split('/')
          return session.ethereumGetAddress(
            // [
            // (parseInt(pathArray[1]) | hardeningConstant) >>> 0,
            // (parseInt(pathArray[2]) | hardeningConstant) >>> 0,
            // (parseInt(pathArray[3]) | hardeningConstant) >>> 0,
            // parseInt(pathArray[4]),
            // parseInt(pathArray[5])
            // ]
            parseHDPath(path)
          , false)
          .then(function (result) {
            cb(JSON.stringify({path: path, address: result.message.address}));
          })
        }
        if (method === 'signtx') {
          const {path, tx} = params
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
    } catch (err) {
      console.error(`Request to '${req.url}' failed with error:`, err);
      res = {
        error: {
          code: 500,
          type: err.name,
          message: err.message
        }
      };
      cb(JSON.stringify(res));
    }
  
  })
}

function registerProtocol(mainWindow) {
  listenHardwareWallets(mainWindow)
  listenHardwareWalletMethods()
}

module.exports = {
  registerProtocol: registerProtocol
}
const { protocol, BrowserWindow } = require('electron');
const {DeviceList} = require('trezor.js')

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
    device.on('pin', () => {});
    
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

function listenHardwareWalletMethods() {
  protocol.registerStringProtocol(PROTOCOL_NAME, async (req, cb) => {
    let res;
    try {
      const method = getMethod(req);
      const params = getParams(method, req);
      console.log('api', method, params)
      const {id, path} = params
      // const data = await handlers[method](params);
      if (method === 'getaddress') {
        const hardeningConstant = 0x80000000;
        const pathArray = path.replace("'").split('/')
        devices[id].waitForSessionAndRun(function (session) {
          return session.ethereumGetAddress([
            (parseInt(pathArray[1]) | hardeningConstant) >>> 0,
            (parseInt(pathArray[2]) | hardeningConstant) >>> 0,
            (parseInt(pathArray[3]) | hardeningConstant) >>> 0,
            parseInt(pathArray[4]),
            parseInt(pathArray[5])
          ], false)
        })
        .then(function (result) {
            console.log('Address:', result.message.address);
            cb(JSON.stringify({path: path, address: result.message.address}));
        }).catch(e => {
          console.log('addr err', e)
        })
      }
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
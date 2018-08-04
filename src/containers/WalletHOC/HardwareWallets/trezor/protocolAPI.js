import {DeviceList} from 'trezor.js'
const { ipcRenderer, webFrame } = require ('electron');

if (webFrame) {
  webFrame.registerURLSchemeAsPrivileged('wallet');
}

export function listenDevices(emit) {
  var debug = false;
  const deviceList = new DeviceList({debug});
  global.list = deviceList
  deviceList.on('connect', function (device) {
    const deviceId = device.features.device_id
    devices[deviceId] = device
    console.log("Connected device " + deviceId);
    // What to do on user interactions:
    device.on('pin', () => {});
    device.on('passphrase', (cb) => {
      console.log('pass phrase')
      cb(undefined, '121088')
    });
    
    // For convenience, device emits 'disconnect' event on disconnection.
    device.on('disconnect', function () {
      console.log('Disconnected an opened device');
      delete devices[deviceId]
      emit({deviceId, status: 'disconnected'})
    });

    device.on('error', (err) => {
      console.log('device err', err)
      emit({deviceId, status: 'disconnected'})
      //Error: closed device
    })
    emit({deviceId, status: 'connected'})

  })
}

export function acquireDevice(deviceId) {
  if (devices[deviceId]) {
    return devices[deviceId]
  }
}

export function getAddresses({id, paths}) {
  console.log(devices)
  const device = acquireDevice(id)
  if (!device) {
    throw new Error('Device not connected')
  }
  const hardeningConstant = 0x80000000;
  const addresses = []
  return device.waitForSessionAndRun(function (session) {
    let promise = Promise.resolve()
    for (let i=0; i<paths.length; i++) {
      let path = paths[i]
      const pathArray = path.replace("'").split('/')
      promise = promise.then(() => {
        return session.ethereumGetAddress([
          (parseInt(pathArray[1]) | hardeningConstant) >>> 0,
          (parseInt(pathArray[2]) | hardeningConstant) >>> 0,
          (parseInt(pathArray[3]) | hardeningConstant) >>> 0,
          parseInt(pathArray[4]),
          parseInt(pathArray[5])
        ], false)
        .then(function (result) {
          console.log('Address:', result.message.address);
          addresses.push({path, address: result.message.address})
        })
      })
    }
    return promise.then(() => {
      return addresses
    })
  })
}
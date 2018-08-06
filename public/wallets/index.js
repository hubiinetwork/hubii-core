const { protocol } = require('electron');

const {handlers, protocolNames, walletTypes} = require('./handlers')

protocol.registerStandardSchemes(protocolNames);

function listenHardwareWallets (type, mainWindow) {
  handlers[type].deviceEventListener(mainWindow)
}

function listenHardwareWalletMethods(type) {
  const handler = handlers[type]
  console.log('type', type)
  protocol.registerStringProtocol(handler.PROTOCOL_NAME, async (req, cb) => {
    let res;
    try {
      const method = getMethod(req);
      const params = getParams(method, req);
      console.log('api', method, params)
      handler.listenWalletMethods(method, params, cb)
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

function getMethod(req) {
  const urlSplit = req.url.split(`://`);

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
    const params = JSON.parse(data.bytes.toString());
    return params
  } catch (err) {
    throw new Error(`Invalid JSON blob provided for '${method}': ${err.message}`);
  }
}

function registerWalletListeners(mainWindow) {
  walletTypes.forEach(type => {
    listenHardwareWallets(type, mainWindow)
    listenHardwareWalletMethods(type)
  })
}

module.exports = {
  registerWalletListeners: registerWalletListeners,
  handlers: handlers
}
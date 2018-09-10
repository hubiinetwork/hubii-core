const { protocol } = require('electron');

const { loadHandlers, protocolNames } = require('./handlers');
protocol.registerStandardSchemes(protocolNames);

function listenHardwareWallets(handler) {
  handler.deviceEventListener();
}

async function listenHardwareWalletMethods(handler) {
  let protocolName;
  if (typeof handler.PROTOCOL_NAME === 'string') {
    protocolName = handler.PROTOCOL_NAME;
  }
  if (typeof handler.PROTOCOL_NAME === 'function') {
    protocolName = await handler.PROTOCOL_NAME();
  }
  protocol.registerStringProtocol(protocolName, async (req, cb) => {
    let res;
    try {
      const method = getMethod(req);
      const params = getParams(method, req);
      res = await handler.execWalletMethods(method, params);
    } catch (err) {
      res = {
        error: {
          code: 500,
          type: err.name,
          message: err.message,
        },
      };
    }
    cb(JSON.stringify(res));
  });
}

function getMethod(req) {
  const urlSplit = req.url.split('://');

  if (!urlSplit[1]) {
    throw new Error('No method provided');
  }

  const method = urlSplit[1].replace('/', '');

  return method;
}

function getParams(method, req) {
  const data = req.uploadData.find((d) => !!d.bytes);

  if (!data) {
    throw new Error(`No data provided for '${method}'`);
  }

  try {
    const params = JSON.parse(data.bytes.toString());
    return params;
  } catch (err) {
    throw new Error(`Invalid JSON blob provided for '${method}': ${err.message}`);
  }
}

export async function registerWalletListeners() {
  const handlers = await loadHandlers();
  Object.keys(handlers).forEach((type) => {
    const handler = handlers[type];
    listenHardwareWallets(handler);
    listenHardwareWalletMethods(handler);
  });
}


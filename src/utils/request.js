import 'whatwg-fetch';
// Requests a URL, returning a promise. By default uses striim endpoint
export default function request(path, opts = {}, endpoint) {
  return fetch(endpoint + path, opts)
    .then(checkStatus)
    .then(parseJSON);
}

export function requestWalletAPI(path, network, opts = {}) {
  const options = opts;
  options.headers = {
    Authorization: `Bearer ${network.identityServiceToken}`,

  };
  return request(path, options, network.walletApiEndpoint());
}

export function requestHardwareWalletAPI(path, opts = {}, endpoint = 'trezor://') {
  return request(path, {
    method: 'POST',
    body: JSON.stringify(opts),
  }, endpoint)
  .then((response) => {
    if (response.error) {
      throw new Error(response.error.message);
    }
    return response;
  });
}

// Checks if a network request came back fine, and throws an error if not
export function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

// Parses the JSON returned by a network request
export function parseJSON(response) {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  return response.json();
}

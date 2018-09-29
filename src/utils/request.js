import 'whatwg-fetch';
import { SECRET, APPID, HUBII_WALLET_SECRET } from 'config/constants';
// Requests a URL, returning a promise. By default uses striim endpoint
export default function request(path, opts = {}, endpoint) {
  return fetch(endpoint + path, opts)
    .then(checkStatus)
    .then(parseJSON);
}

export function requestWalletAPI(path, endpoint, opts = {}) {
  const options = {
    headers: {
      Authorization: `Bearer ${opts.token}`,
    },
  };
  return request(path, options, endpoint);
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

export function requestAPIToken(path, endpoint) {
  const options = {
    appid: APPID,
    secret: SECRET,
  };
  console.log(HUBII_WALLET_SECRET);
  return request(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
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

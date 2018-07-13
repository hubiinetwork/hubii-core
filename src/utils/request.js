import 'whatwg-fetch';
import jwt from 'jsonwebtoken';

// Requests a URL, returning a promise. By default uses striim endpoint
export default function request(path, opts = {}, endpoint) {
  return fetch(endpoint + path, opts)
    .then(checkStatus)
    .then(parseJSON);
}

export function requestWalletAPI(path, opts = {}, endpoint = process.env.WALLET_API) {
  const options = opts;
  const token = jwt.sign({ exp: Math.floor((new Date().getTime() / 1000) + 10) }, '***REMOVED***');
  options.headers = {
    Authorization: `Bearer ${token}`,
  };
  return request(path, options, endpoint);
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

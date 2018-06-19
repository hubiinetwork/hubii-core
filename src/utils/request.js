import 'whatwg-fetch';

const defaultDevEndpoint = 'http://localhost:8000/';
const defaultProdEndpoint = 'https://api.striim.io/';

// Inserts the dev or prod endpoint for the striim api server
function getDefaultEndpoint() {
  /* istanbul ignore next */
  return process.env.NODE_ENV === 'development' ? defaultDevEndpoint : defaultProdEndpoint;
}

// Requests a URL, returning a promise. By default uses striim endpoint
export default function request(path, options, endpoint = getDefaultEndpoint()) {
  return fetch(endpoint + path, options)
    .then(checkStatus)
    .then(parseJSON);
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

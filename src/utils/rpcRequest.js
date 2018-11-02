/**
 * Modified version of the ethers.js providers.Provider.fetchJson, allowing batched RPC requests
 */
export default function (url, json) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();

    if (json) {
      request.open('POST', url, true);
      request.setRequestHeader('Content-Type', 'application/json');
    } else {
      request.open('GET', url, true);
    }

    request.onreadystatechange = () => {
      if (request.readyState !== 4) { return; }

      let result;
      try {
        result = JSON.parse(request.responseText);
      } catch (error) {
        const jsonError = new Error('invalid json response');
        jsonError.orginialError = error;
        jsonError.responseText = request.responseText;
        reject(jsonError);
        return;
      }

      if (request.status !== 200) {
        const error = new Error(`invalid response - ${request.status}`);
        error.statusCode = request.statusCode;
        reject(error);
        return;
      }

      resolve(result);
    };

    request.onerror = (error) => {
      reject(error);
    };

    try {
      if (json) {
        request.send(json);
      } else {
        request.send();
      }
    } catch (error) {
      const connectionError = new Error('connection error');
      connectionError.error = error;
      reject(connectionError);
    }
  });
}

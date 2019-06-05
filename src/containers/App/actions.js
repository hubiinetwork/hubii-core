import {
  NOTIFY,
  CHANGE_NETWORK,
  INIT_NETWORK_ACTIVITY,
  INIT_NAHMII_PROVIDERS,
  UPDATE_NAHMII_PROVIDER,
  UPDATE_CURRENT_NETWORK_NAHMII_PROVIDER,
  BATCH_EXPORT,
  BATCH_EXPORT_SUCCESS,
  BATCH_EXPORT_ERROR,
  BATCH_IMPORT,
  BATCH_IMPORT_ERROR,
  BATCH_IMPORT_SUCCESS,
  DECRYPT_IMPORT,
  DECRYPT_IMPORT_SUCCESS,
  DECRYPT_IMPORT_ERROR,
} from './constants';


export function notify(messageType, message, customDuration) {
  return {
    type: NOTIFY,
    messageType,
    message,
    customDuration,
  };
}

export function changeNetwork(name) {
  return {
    type: CHANGE_NETWORK,
    name,
  };
}

export function initNahmiiProviders() {
  return {
    type: INIT_NAHMII_PROVIDERS,
  };
}

export function updateNahmiiProvider(nahmiiProvider, networkName) {
  return {
    type: UPDATE_NAHMII_PROVIDER,
    nahmiiProvider,
    networkName,
  };
}

export function updateCurrentNetworkNahmiiProvider(nahmiiProvider) {
  return {
    type: UPDATE_CURRENT_NETWORK_NAHMII_PROVIDER,
    nahmiiProvider,
  };
}

export function initNetworkActivity() {
  return {
    type: INIT_NETWORK_ACTIVITY,
  };
}

export function batchExport(password, filePath) {
  return {
    type: BATCH_EXPORT,
    password,
    filePath,
  };
}

export function batchExportSuccess() {
  return {
    type: BATCH_EXPORT_SUCCESS,
  };
}

export function batchExportError(error) {
  return {
    type: BATCH_EXPORT_ERROR,
    error,
  };
}

export function batchImport() {
  return {
    type: BATCH_IMPORT,
  };
}

export function batchImportSuccess() {
  return {
    type: BATCH_IMPORT_SUCCESS,
  };
}

export function batchImportError() {
  return {
    type: BATCH_IMPORT_ERROR,
  };
}

export function decryptImport(password, filePath) {
  return {
    type: DECRYPT_IMPORT,
    password,
    filePath,
  };
}

export function decryptImportSuccess(decryptedContent) {
  return {
    type: DECRYPT_IMPORT_SUCCESS,
    decryptedContent,
  };
}

export function decryptImportError(error) {
  return {
    type: DECRYPT_IMPORT_ERROR,
    error,
  };
}

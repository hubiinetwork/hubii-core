import {
  NOTIFY,
  CHANGE_NETWORK,
  INIT_NETWORK_ACTIVITY,
  INIT_NAHMII_PROVIDERS,
  UPDATE_NAHMII_PROVIDER,
  UPDATE_CURRENT_NETWORK_NAHMII_PROVIDER,
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

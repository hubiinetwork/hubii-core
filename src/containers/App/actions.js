import { SUPPORTED_NETWORKS } from 'config/constants';
import {
  NOTIFY,
  CHANGE_NETWORK,
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
    network: SUPPORTED_NETWORKS[name],
  };
}

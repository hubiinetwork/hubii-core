import {
  NETWORK_FAILURE,
  NETWORK_RECONNECTED,
} from './constants';

export function networkFailure(errorType) {
  return {
    type: NETWORK_FAILURE,
    errorType,
  };
}

export function networkReconnected(errorType) {
  return {
    type: NETWORK_RECONNECTED,
    errorType,
  };
}

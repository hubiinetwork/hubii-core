/*
 *
 * Trezor reducer
 *
 */

import { fromJS } from 'immutable';
import {
  trezorDisconnectedErrorMsg,
} from 'utils/friendlyErrors';
import {
  TREZOR_CONNECTED,
  TREZOR_DISCONNECTED,
  FETCHED_TREZOR_ADDRESS,
  TREZOR_ERROR,
  TREZOR_CONFIRM_TX_ON_DEVICE,
  TREZOR_CONFIRM_TX_ON_DEVICE_DONE,
} from './constants';

const initialState = fromJS({
  status: 'disconnected',
  addresses: {},
  id: null,
  confTxOnDevice: false,
  error: trezorDisconnectedErrorMsg,
});

function trezorHocReducer(state = initialState, action) {
  switch (action.type) {
    case TREZOR_CONNECTED:
      return state
        .set('status', 'connected')
        .set('id', action.deviceId)
        .set('error', null);
    case TREZOR_DISCONNECTED:
      return state
        .set('status', 'disconnected')
        .set('id', null);
    case FETCHED_TREZOR_ADDRESS:
      return state
        .setIn(['addresses', action.derivationPath], action.address);
    case TREZOR_ERROR:
      return state
        .set('status', 'disconnected')
        .set('addresses', fromJS({}))
        .set('error', action.error);
    case TREZOR_CONFIRM_TX_ON_DEVICE:
      return state
        .set('confTxOnDevice', true);
    case TREZOR_CONFIRM_TX_ON_DEVICE_DONE:
      return state
        .set('confTxOnDevice', false);
    default:
      return state;
  }
}

export default trezorHocReducer;

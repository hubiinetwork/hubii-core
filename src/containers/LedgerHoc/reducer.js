/*
 *
 * LedgerHoc reducer
 *
 */

import { fromJS } from 'immutable';
import { disconnectedErrorMsg } from 'utils/friendlyErrors';
import {
  FETCHED_LEDGER_ADDRESS,
  LEDGER_CONNECTED,
  LEDGER_DISCONNECTED,
  LEDGER_ETH_CONNECTED,
  LEDGER_ETH_DISCONNECTED,
  LEDGER_ERROR,
  LEDGER_CONFIRM_TX_ON_DEVICE,
  LEDGER_CONFIRM_TX_ON_DEVICE_DONE,
} from './constants';

const initialState = fromJS({
  status: 'disconnected',
  ethConnected: false,
  connected: false,
  addresses: {},
  id: null,
  confTxOnDevice: false,
  error: disconnectedErrorMsg,
});

function ledgerHocReducer(state = initialState, action) {
  switch (action.type) {
    case LEDGER_ETH_CONNECTED:
      return state
        .set('status', 'connected')
        .set('id', action.id)
        .set('error', null)
        .set('ethConnected', true);
    case LEDGER_ETH_DISCONNECTED:
      return state
        .set('status', 'disconnected')
        .set('ethConnected', false);
    case LEDGER_CONNECTED:
      return state
        .set('status', 'connected')
        .set('connected', true)
        .set('error', null)
        .set('descriptor', action.descriptor);
    case LEDGER_DISCONNECTED:
      return state
        .set('status', 'disconnected')
        .set('ethConnected', false)
        .set('connected', false)
        .set('descriptor', null)
        .set('id', null);
    case LEDGER_ERROR:
      return state
        .set('status', 'disconnected')
        .set('addresses', fromJS({}))
        .set('error', action.error);
    case FETCHED_LEDGER_ADDRESS:
      return state
        .setIn(['addresses', action.derivationPath], action.address);
    case LEDGER_CONFIRM_TX_ON_DEVICE:
      return state
        .set('confTxOnDevice', true);
    case LEDGER_CONFIRM_TX_ON_DEVICE_DONE:
      return state
        .set('confTxOnDevice', false);
    default:
      return state;
  }
}

export default ledgerHocReducer;

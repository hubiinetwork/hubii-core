/*
 *
 * nahmiiHoc reducer
 *
 */

import { fromJS } from 'immutable';

import {
  DEPOSIT,
  DEPOSIT_SUCCESS,
  LOAD_NAHMII_BALANCES_SUCCESS,
  START_PAYMENT_CHALLENGE_SUCCESS,
  START_PAYMENT_CHALLENGE_ERROR,
  LOAD_START_PAYMENT_CHALLENGE_TX_REQUEST,
  SETTLE_PAYMENT_DRIIP_SUCCESS,
  SETTLE_PAYMENT_DRIIP_ERROR,
  LOAD_SETTLE_PAYMENT_DRIIP_TX_REQUEST,
} from './constants';

export const initialState = fromJS({
  wallets: {},
  balances: {},
});

function nahmiiHocReducer(state = initialState, action) {
  switch (action.type) {
    case DEPOSIT:
      return state
        .setIn(['wallets', action.address, 'depositing'], true);
    case DEPOSIT_SUCCESS:
      return state
        .setIn(['wallets', action.address, 'depositing'], false);
    case START_PAYMENT_CHALLENGE_SUCCESS:
      return state
        .setIn(['wallets', action.address, 'lastPaymentChallenge', 'status'], 'dispute')
        .setIn(['wallets', action.address, 'lastPaymentChallenge', 'txReceipt'], action.txReceipt)
    case START_PAYMENT_CHALLENGE_ERROR:
      return state
        .setIn(['wallets', action.address, 'lastPaymentChallenge', 'status'], 'failed')
        .setIn(['wallets', action.address, 'lastPaymentChallenge', 'txReceipt'], action.txReceipt)
    case LOAD_START_PAYMENT_CHALLENGE_TX_REQUEST:
      return state
        .setIn(['wallets', action.address, 'lastPaymentChallenge', 'txRequest'], action.txRequest)
    case SETTLE_PAYMENT_DRIIP_SUCCESS:
      return state
        .setIn(['wallets', action.address, 'lastSettlePaymentDriip', 'status'], 'success')
        .setIn(['wallets', action.address, 'lastSettlePaymentDriip', 'txReceipt'], action.txReceipt)
    case SETTLE_PAYMENT_DRIIP_ERROR:
      return state
        .setIn(['wallets', action.address, 'lastSettlePaymentDriip', 'status'], 'failed')
        .setIn(['wallets', action.address, 'lastSettlePaymentDriip', 'txReceipt'], action.txReceipt)
    case LOAD_SETTLE_PAYMENT_DRIIP_TX_REQUEST:
      return state
        .setIn(['wallets', action.address, 'lastSettlePaymentDriip', 'txRequest'], action.txRequest)
    case LOAD_NAHMII_BALANCES_SUCCESS:
      return state
        .setIn(['balances', action.address, 'loading'], false)
        .setIn(['balances', action.address, 'error'], null)
        .setIn(['balances', action.address, 'assets'], action.balances);
    default:
      return state;
  }
}

export default nahmiiHocReducer;

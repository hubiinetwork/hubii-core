/*
 *
 * nahmiiHoc reducer
 *
 */

import { fromJS } from 'immutable';

import { CHANGE_NETWORK } from 'containers/App/constants';
import {
  SET_SELECTED_WALLET_CURRENCY,
  LOAD_NAHMII_BALANCES_SUCCESS,
  LOAD_NAHMII_STAGED_BALANCES_SUCCESS,
  LOAD_NAHMII_STAGING_BALANCES_SUCCESS,
  START_CHALLENGE,
  START_CHALLENGE_SUCCESS,
  START_CHALLENGE_ERROR,
  START_REQUIRED_CHALLENGES_SUCCESS,
  LOAD_START_CHALLENGE_TX_REQUEST,
  LOAD_START_CHALLENGE_TX_RECEIPT_SUCCESS,
  LOAD_START_CHALLENGE_TX_RECEIPT_ERROR,
  SETTLE,
  SETTLE_SUCCESS,
  SETTLE_ERROR,
  SETTLE_ALL_CHALLENGES_SUCCESS,
  LOAD_SETTLE_TX_REQUEST,
  LOAD_SETTLE_TX_RECEIPT_SUCCESS,
  WITHDRAW,
  WITHDRAW_SUCCESS,
  WITHDRAW_ERROR,
  LOAD_WITHDRAW_TX_REQUEST,
  LOAD_WITHDRAW_TX_RECEIPT_SUCCESS,
  LOAD_NAHMII_RECEIPTS,
  LOAD_NAHMII_RECEIPTS_SUCCESS,
  LOAD_NAHMII_RECEIPTS_ERROR,
  NAHMII_DEPOSIT_ETH,
  NAHMII_DEPOSIT_ETH_SUCCESS,
  NAHMII_APPROVE_TOKEN_DEPOSIT,
  NAHMII_APPROVE_TOKEN_DEPOSIT_SUCCESS,
  NAHMII_COMPLETE_TOKEN_DEPOSIT,
  NAHMII_COMPLETE_TOKEN_DEPOSIT_SUCCESS,
  NAHMII_DEPOSIT_FAILED,
  LOAD_ONGOING_CHALLENGES_SUCCESS,
  LOAD_ONGOING_CHALLENGES_ERROR,
  LOAD_SETTLEABLE_CHALLENGES_SUCCESS,
  LOAD_SETTLEABLE_CHALLENGES_ERROR,
  RELOAD_SETTLEMENT_STATES,
} from './constants';

export const initialState = fromJS({
  wallets: {},
  balances: {},
  receipts: {},
  transactions: {},
  selectedCurrency: '0x0000000000000000000000000000000000000000',
  depositStatus: {
    depositingEth: false,
    approvingTokenDeposit: false,
    completingTokenDeposit: false,
    error: null,
  },
  ongoingChallenges: {},
  settleableChallenges: {},
  withdrawals: {},
  newSettlementPendingTxs: {},
});

function nahmiiHocReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SELECTED_WALLET_CURRENCY:
      return state.set('selectedCurrency', action.currencyAddress);
    case NAHMII_DEPOSIT_ETH:
      return state
        .setIn(['depositStatus', 'depositingEth'], true)
        .setIn(['depositStatus', 'error'], null);
    case NAHMII_DEPOSIT_ETH_SUCCESS:
      return state
        .setIn(['depositStatus', 'depositingEth'], false)
        .setIn(['depositStatus', 'error'], null);
    case NAHMII_APPROVE_TOKEN_DEPOSIT:
      return state
        .setIn(['depositStatus', 'approvingTokenDeposit'], true)
        .setIn(['depositStatus', 'error'], null);
    case NAHMII_APPROVE_TOKEN_DEPOSIT_SUCCESS:
      return state
        .setIn(['depositStatus', 'approvingTokenDeposit'], false)
        .setIn(['depositStatus', 'error'], null);
    case NAHMII_COMPLETE_TOKEN_DEPOSIT:
      return state
        .setIn(['depositStatus', 'completingTokenDeposit'], true)
        .setIn(['depositStatus', 'error'], null);
    case NAHMII_COMPLETE_TOKEN_DEPOSIT_SUCCESS:
      return state
        .setIn(['depositStatus', 'completingTokenDeposit'], false)
        .setIn(['depositStatus', 'error'], null);
    case NAHMII_DEPOSIT_FAILED:
      return state
        .setIn(['depositStatus', 'depositingEth'], false)
        .setIn(['depositStatus', 'approvingTokenDeposit'], false)
        .setIn(['depositStatus', 'completingTokenDeposit'], false)
        .setIn(['depositStatus', 'error'], action.error);
    case LOAD_NAHMII_BALANCES_SUCCESS:
      return state
        .setIn(['balances', action.address, 'available', 'loading'], false)
        .setIn(['balances', action.address, 'available', 'error'], null)
        .setIn(['balances', action.address, 'available', 'assets'], fromJS(action.balances));
    case LOAD_NAHMII_STAGED_BALANCES_SUCCESS:
      return state
        .setIn(['balances', action.address, 'staged', 'loading'], false)
        .setIn(['balances', action.address, 'staged', 'error'], null)
        .setIn(['balances', action.address, 'staged', 'assets'], fromJS(action.balances));
    case LOAD_NAHMII_STAGING_BALANCES_SUCCESS:
      return state
        .setIn(['balances', action.address, 'staging', 'loading'], false)
        .setIn(['balances', action.address, 'staging', 'error'], null)
        .setIn(['balances', action.address, 'staging', 'assets'], fromJS(action.balances));
    case LOAD_ONGOING_CHALLENGES_SUCCESS:
      return state
        .setIn(['ongoingChallenges', action.address, action.currencyAddress, 'loading'], false)
        .setIn(['ongoingChallenges', action.address, action.currencyAddress, 'details'], action.challenges);
    case LOAD_ONGOING_CHALLENGES_ERROR:
      return state
        .setIn(['ongoingChallenges', action.address, action.currencyAddress, 'details'], null);
    case LOAD_SETTLEABLE_CHALLENGES_SUCCESS:
      return state
        .setIn(['settleableChallenges', action.address, action.currencyAddress, 'loading'], false)
        .setIn(['settleableChallenges', action.address, action.currencyAddress, 'details'], action.challenges)
        .setIn(['settleableChallenges', action.address, action.currencyAddress, 'invalidReasons'], action.invalidReasons);
    case LOAD_SETTLEABLE_CHALLENGES_ERROR:
      return state
        .setIn(['settleableChallenges', action.address, action.currencyAddress, 'details'], null);
    case RELOAD_SETTLEMENT_STATES:
      return state
        .setIn(['ongoingChallenges', action.address, action.currency, 'loading'], true)
        .setIn(['settleableChallenges', action.address, action.currency, 'loading'], true);
    case START_CHALLENGE:
      return state
        .setIn(['ongoingChallenges', action.address, action.currency, 'status'], 'requesting');
    case START_REQUIRED_CHALLENGES_SUCCESS:
      return state
        .setIn(['ongoingChallenges', action.address, action.currency, 'status'], 'success');
    case START_CHALLENGE_SUCCESS:
      return state
        .setIn(['ongoingChallenges', action.address, action.currency, 'status'], 'success')
        .setIn(['ongoingChallenges', action.address, action.currency, 'transactions', action.txReceipt.transactionHash], action.txReceipt)
        .deleteIn(['newSettlementPendingTxs', action.address, action.currency, action.txReceipt.transactionHash]);
    case START_CHALLENGE_ERROR:
      return state
        .setIn(['ongoingChallenges', action.address, action.currency, 'status'], 'failed');
    case LOAD_START_CHALLENGE_TX_REQUEST:
      return state
        .setIn(['ongoingChallenges', action.address, action.currency, 'status'], 'mining')
        .setIn(['ongoingChallenges', action.address, action.currency, 'transactions', action.txRequest.hash], action.txRequest)
        .setIn(['newSettlementPendingTxs', action.address, action.currency, action.txRequest.hash], fromJS({
          ...action.txRequest,
          timestamp: action.txRequest.timestamp || new Date().getTime(),
        }));
    case LOAD_START_CHALLENGE_TX_RECEIPT_SUCCESS:
      return state
        .setIn(['ongoingChallenges', action.address, action.currency, 'status'], 'receipt')
        .setIn(['ongoingChallenges', action.address, action.currency, 'transactions', action.txReceipt.transactionHash], action.txReceipt);
    case LOAD_START_CHALLENGE_TX_RECEIPT_ERROR:
      return state
        .deleteIn(['newSettlementPendingTxs', action.address, action.currency, action.txReceipt.transactionHash]);
    case SETTLE:
      return state
        .setIn(['settleableChallenges', action.address, action.currency, 'status'], 'requesting');
    case SETTLE_ALL_CHALLENGES_SUCCESS:
      return state
        .setIn(['settleableChallenges', action.address, action.currency, 'details'], null)
        .setIn(['settleableChallenges', action.address, action.currency, 'status'], 'success');
    case SETTLE_SUCCESS:
      return state
        .setIn(['settleableChallenges', action.address, action.currency, 'transactions', action.txReceipt.transactionHash], action.txReceipt);
    case SETTLE_ERROR:
      return state
        .setIn(['settleableChallenges', action.address, action.currency, 'status'], 'failed');
    case LOAD_SETTLE_TX_REQUEST:
      return state
        .setIn(['settleableChallenges', action.address, action.currency, 'status'], 'mining')
        .setIn(['settleableChallenges', action.address, action.currency, 'transactions', action.txRequest.hash], action.txRequest);
    case LOAD_SETTLE_TX_RECEIPT_SUCCESS:
      return state
        .setIn(['settleableChallenges', action.address, action.currency, 'status'], 'receipt')
        .setIn(['settleableChallenges', action.address, action.currency, 'transactions', action.txReceipt.transactionHash], action.txReceipt);
    case WITHDRAW:
      return state
        .setIn(['withdrawals', action.address, action.currency, 'status'], 'requesting');
    case WITHDRAW_SUCCESS:
      return state
        .setIn(['withdrawals', action.address, action.currency, 'status'], 'success')
        .setIn(['withdrawals', action.address, action.currency, 'transactions', action.txReceipt.transactionHash], action.txReceipt);
    case WITHDRAW_ERROR:
      return state
        .setIn(['withdrawals', action.address, action.currency, 'status'], 'failed');
    case LOAD_WITHDRAW_TX_REQUEST:
      return state
        .setIn(['withdrawals', action.address, action.currency, 'status'], 'mining')
        .setIn(['withdrawals', action.address, action.currency, 'transactions', action.txRequest.hash], action.txRequest);
    case LOAD_WITHDRAW_TX_RECEIPT_SUCCESS:
      return state
        .setIn(['withdrawals', action.address, action.currency, 'status'], 'receipt')
        .setIn(['withdrawals', action.address, action.currency, 'transactions', action.txReceipt.transactionHash], action.txReceipt);
    case LOAD_NAHMII_RECEIPTS:
      return state
        .setIn(['receipts', action.address, 'available', 'loading'], true)
        .setIn(['receipts', action.address, 'available', 'error'], null)
        .setIn(['receipts', action.address, 'available', 'assets'], fromJS([]));
    case LOAD_NAHMII_RECEIPTS_SUCCESS:
      return state
        .setIn(['receipts', action.address, 'loading'], false)
        .setIn(['receipts', action.address, 'error'], null)
        .setIn(['receipts', action.address, 'receipts'], fromJS(action.receipts));
    case LOAD_NAHMII_RECEIPTS_ERROR:
      return state
        .setIn(['receipts', action.address, 'loading'], false)
        .setIn(['receipts', action.address, 'error'], action.error)
        .setIn(['receipts', action.address, 'receipts'], fromJS([]));
    case CHANGE_NETWORK:
      return state
        .set('balances', initialState.get('balances'))
        .set('receipts', initialState.get('receipts'))
        .set('ongoingChallenges', initialState.get('ongoingChallenges'))
        .set('settleableChallenges', initialState.get('settleableChallenges'))
        .set('withdrawals', initialState.get('withdrawals'));
    default:
      return state;
  }
}

export default nahmiiHocReducer;

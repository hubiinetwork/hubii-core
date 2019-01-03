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
  LOAD_START_CHALLENGE_TX_REQUEST,
  SETTLE,
  SETTLE_SUCCESS,
  SETTLE_ERROR,
  LOAD_SETTLE_TX_REQUEST,
  WITHDRAW,
  WITHDRAW_SUCCESS,
  WITHDRAW_ERROR,
  LOAD_WITHDRAW_TX_REQUEST,
  // LOAD_ONGOING_CHALLENGES_SUCCESS,
  // LOAD_ONGOING_CHALLENGES_ERROR,
  // LOAD_SETTLEABLE_CHALLENGES_SUCCESS,
  // LOAD_SETTLEABLE_CHALLENGES_ERROR,
  // LOAD_CURRENT_PAYMENT_CHALLENGE_PHASE_SUCCESS,
  // LOAD_CURRENT_PAYMENT_CHALLENGE_PHASE_ERROR,
  // LOAD_CURRENT_PAYMENT_CHALLENGE_STATUS_SUCCESS,
  // LOAD_CURRENT_PAYMENT_CHALLENGE_STATUS_ERROR,
  // LOAD_SETTLEMENT_SUCCESS,
  // LOAD_SETTLEMENT_ERROR,
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
} from './constants';

export const initialState = fromJS({
  wallets: {},
  balances: {},
  receipts: {},
  transactions: {},
  selectedCurrency: 'ETH',
  depositStatus: {
    depositingEth: false,
    approvingTokenDeposit: false,
    completingTokenDeposit: false,
    error: null,
  },
  ongoingChallenges: {},
  settleableChallenges: {},
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
    case START_CHALLENGE:
      return state
          .setIn(['ongoingChallenges', action.address, action.currency, 'status'], 'processing');
    case START_CHALLENGE_SUCCESS:
      return state
          .setIn(['ongoingChallenges', action.address, action.currency, 'status'], 'success')
          .setIn(['ongoingChallenges', action.address, action.currency, 'transactions', action.txReceipt.transactionHash], action.txReceipt);
    case START_CHALLENGE_ERROR:
      return state
          .setIn(['ongoingChallenges', action.address, action.currency, 'status'], 'failed');
    case LOAD_START_CHALLENGE_TX_REQUEST:
      return state
        .setIn(['ongoingChallenges', action.address, action.currency, 'transactions', action.txRequest.hash], action.txRequest);
    case SETTLE:
      return state
        .setIn(['settleableChallenges', action.address, action.currency, 'status'], 'processing');
    case SETTLE_SUCCESS:
      return state
        .setIn(['settleableChallenges', action.address, action.currency, 'status'], 'success')
        .setIn(['settleableChallenges', action.address, action.currency, 'transactions', action.txReceipt.transactionHash], action.txReceipt);
    case SETTLE_ERROR:
      return state
        .setIn(['settleableChallenges', action.address, action.currency, 'status'], 'failed');
    case LOAD_SETTLE_TX_REQUEST:
      return state
        .setIn(['wallets', action.address, 'lastSettlePaymentDriip', 'txStatus'], 'mining')
        .setIn(['wallets', action.address, 'lastSettlePaymentDriip', 'txRequest'], action.txRequest)
        .setIn(['transactions', action.address, action.currency, action.txRequest.hash, 'type'], 'settle_payment')
        .setIn(['transactions', action.address, action.currency, action.txRequest.hash, 'network'], action.networkName)
        .setIn(['transactions', action.address, action.currency, action.txRequest.hash, 'createdAt'], new Date().getTime())
        .setIn(['transactions', action.address, action.currency, action.txRequest.hash, 'request'], action.txRequest);
    case WITHDRAW:
      return state
        .setIn(['withdrawals', action.address, action.currency, 'status'], 'processing');
    case WITHDRAW_SUCCESS:
      return state
        .setIn(['withdrawals', action.address, action.currency, 'status'], 'success')
        .setIn(['withdrawals', action.address, action.currency, 'transactions', action.txReceipt.transactionHash], action.txReceipt);
    case WITHDRAW_ERROR:
      return state
        .setIn(['withdrawals', action.address, action.currency, 'status'], 'failed');
    case LOAD_WITHDRAW_TX_REQUEST:
      return state
        .setIn(['wallets', action.address, 'lastWithdraw', 'txRequest'], action.txRequest)
        .setIn(['transactions', action.address, action.currency, action.txRequest.hash, 'type'], 'withdraw')
        .setIn(['transactions', action.address, action.currency, action.txRequest.hash, 'network'], action.networkName)
        .setIn(['transactions', action.address, action.currency, action.txRequest.hash, 'createdAt'], new Date().getTime())
        .setIn(['transactions', action.address, action.currency, action.txRequest.hash, 'request'], action.txRequest);

    // case LOAD_CURRENT_PAYMENT_CHALLENGE_PHASE_SUCCESS:
    //   return state
    //     .setIn(['wallets', action.address, 'lastPaymentChallenge', 'phase'], action.phase);
    // case LOAD_CURRENT_PAYMENT_CHALLENGE_PHASE_ERROR:
    //   return state
    //     .setIn(['wallets', action.address, 'lastPaymentChallenge', 'phase'], null);
    // case LOAD_ONGOING_CHALLENGES_SUCCESS:
    //   return state
    //     .setIn(['ongoingChallenges', action.address, action.currencyAddress, 'details'], action.challenges);
    //     // .setIn(['ongoingChallenges', action.address, action.currencyAddress, 'updatedAt'], new Date());
    // case LOAD_ONGOING_CHALLENGES_ERROR:
    //   return state
    //     .setIn(['ongoingChallenges', action.address, action.currencyAddress, 'details'], null);
    //     // .setIn(['ongoingChallenges', action.address, action.currencyAddress, 'updatedAt'], new Date());
    // case LOAD_SETTLEABLE_CHALLENGES_SUCCESS:
    //   return state
    //     .setIn(['settleableChallenges', action.address, action.currencyAddress, 'details'], action.challenges);
    //     // .setIn(['settleableChallenges', action.address, action.currencyAddress, 'updatedAt'], new Date());
    // case LOAD_SETTLEABLE_CHALLENGES_ERROR:
    //   return state
    //     .setIn(['settleableChallenges', action.address, action.currencyAddress, 'details'], null);
    //     // .setIn(['settleableChallenges', action.address, action.currencyAddress, 'updatedAt'], new Date());
    // case LOAD_CURRENT_PAYMENT_CHALLENGE_STATUS_SUCCESS:
    //   return state
    //     .setIn(['wallets', action.address, 'lastPaymentChallenge', 'status'], action.status);
    // case LOAD_CURRENT_PAYMENT_CHALLENGE_STATUS_ERROR:
    //   return state
    //     .setIn(['wallets', action.address, 'lastPaymentChallenge', 'status'], null);
    // case LOAD_SETTLEMENT_SUCCESS:
    //   return state
    //     .setIn(['wallets', action.address, 'lastSettlePaymentDriip', 'settlement'], action.settlement || {})
    //     .setIn(['wallets', action.address, 'lastSettlePaymentDriip', 'updatedAt'], new Date());
    //     // .setIn(['wallets', action.address, 'lastSettlePaymentDriip', 'loadingSettlement'], false);
    // case LOAD_SETTLEMENT_ERROR:
    //   return state
    //     .setIn(['wallets', action.address, 'lastSettlePaymentDriip', 'settlement'], null)
    //     .setIn(['wallets', action.address, 'lastSettlePaymentDriip', 'updatedAt'], new Date());
    //     // .setIn(['wallets', action.address, 'lastSettlePaymentDriip', 'loadingSettlement'], false);
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
        .set('transactions', initialState.get('transactions'));
    default:
      return state;
  }
}

export default nahmiiHocReducer;

/*
 *
 * WalletHoc reducer
 *
 */

import { fromJS } from 'immutable';
import { ERC20ABI, findWalletIndex } from 'utils/wallet';
import abiDecoder from 'abi-decoder';

import {
  LOAD_WALLET_BALANCES,
  LOAD_WALLET_BALANCES_SUCCESS,
  LOAD_WALLET_BALANCES_ERROR,
  UPDATE_TOKEN_BALANCES,
  CREATE_WALLET_FROM_MNEMONIC,
  CREATE_WALLET_FROM_PRIVATE_KEY,
  CREATE_WALLET_SUCCESS,
  ADD_NEW_WALLET,
  CREATE_WALLET_FAILURE,
  DECRYPT_WALLET,
  DECRYPT_WALLET_FAILURE,
  DECRYPT_WALLET_SUCCESS,
  SET_CURRENT_WALLET,
  SHOW_DECRYPT_WALLET_MODAL,
  HIDE_DECRYPT_WALLET_MODAL,
  TRANSFER,
  TRANSFER_SUCCESS,
  TRANSFER_ERROR,
  LEDGER_DETECTED,
  LEDGER_ERROR,
  FETCHED_LEDGER_ADDRESS,
  SAVE_LEDGER_ADDRESS,
  TRANSACTION_CONFIRMED,
  DELETE_WALLET,
  RESET_DECRYPT_WALLET_CALLBACK,
} from './constants';

export const initialState = fromJS({
  inputs: {
    password: '',
    newWalletName: '',
    derivationPath: '',
  },
  loading: {
    creatingWallet: false,
    decryptingWallet: false,
  },
  errors: {
    creatingWalletError: null,
    decryptingWalletError: null,
    ledgerError: 'Initialising, please try again in a few seconds...',
  },
  wallets: [],
  currentWallet: {
    address: '',
  },
  ledgerNanoSInfo: {
    status: 'disconnected',
    addresses: {},
    id: null,
  },
  pendingTransactions: [],
  confirmedTransactions: [],
  currentDecryptionCallback: null,
});

abiDecoder.addABI(ERC20ABI);

function walletHocReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_WALLET_FROM_MNEMONIC:
    case CREATE_WALLET_FROM_PRIVATE_KEY:
      return state
        .setIn(['loading', 'creatingWallet'], true)
        .setIn(['errors', 'creatingWalletError'], null);
    case CREATE_WALLET_SUCCESS:
      return state
        .setIn(['loading', 'creatingWallet'], false)
        .setIn(['inputs', 'password'], '');
    case ADD_NEW_WALLET:
      return state
        .set('wallets', state
          .get('wallets')
          .push(fromJS(action.newWallet))
        );
    case CREATE_WALLET_FAILURE:
      return state
        .setIn(['loading', 'creatingWallet'], false)
        .setIn(['errors', 'creatingWalletError'], action.error);
    case DECRYPT_WALLET:
      return state
        .setIn(['loading', 'decryptingWallet'], true)
        .setIn(['errors', 'decryptingWalletError'], null)
        .set('progress', 0);
    case DECRYPT_WALLET_SUCCESS:
      return state
          .setIn(['loading', 'decryptingWallet'], false)
          .setIn(['inputs', 'password'], '')
          .setIn(['wallets', findWalletIndex(state, action.address), 'decrypted'], fromJS(action.decryptedWallet));
    case DECRYPT_WALLET_FAILURE:
      return state
        .setIn(['loading', 'decryptingWallet'], false)
        .setIn(['errors', 'decryptingWalletError'], action.error);
    case LOAD_WALLET_BALANCES:
      return state
        .setIn(['wallets', findWalletIndex(state, action.address), 'loadingBalances'], true);
    case LOAD_WALLET_BALANCES_SUCCESS:
      return state
        .setIn(['wallets', findWalletIndex(state, action.address), 'loadingBalances'], false)
        .setIn(['wallets', findWalletIndex(state, action.address), 'loadingBalancesError'], null)
        .setIn(['wallets', findWalletIndex(state, action.address), 'balances'], fromJS(action.tokenBalances.tokens || []));
    case LOAD_WALLET_BALANCES_ERROR:
      return state
        .setIn(['wallets', findWalletIndex(state, action.address), 'loadingBalances'], false)
        .setIn(['wallets', findWalletIndex(state, action.address), 'loadingBalancesError'], action.error);
    case UPDATE_TOKEN_BALANCES:
      {
        return state
          .updateIn(['wallets', findWalletIndex(state, action.address), 'balances'], (balances) => balances.map((balance) => {
            if (balance.get('symbol') === action.newBalance.symbol) {
              return balance.set('balance', action.newBalance.balance);
            }
            return balance;
          }));
      }
    case SHOW_DECRYPT_WALLET_MODAL:
      return state
        .setIn(['currentWallet', 'showDecryptModal'], true)
        .set('currentDecryptionCallback', fromJS(action.callbackAction));
    case RESET_DECRYPT_WALLET_CALLBACK:
      return state
        .setIn('currentDecryptionCallback', null);
    case HIDE_DECRYPT_WALLET_MODAL:
      return state
        .setIn(['currentWallet', 'showDecryptModal'], false);
    case SET_CURRENT_WALLET:
      return state
        .setIn(['currentWallet', 'address'], action.address)
        .setIn(['currentWallet', 'transfering'], false)
        .setIn(['currentWallet', 'transferError'], null)
        .setIn(['currentWallet', 'lastTransaction'], null);
    case TRANSFER:
      return state
        .setIn(['currentWallet', 'transfering'], true)
        .setIn(['currentWallet', 'transferError'], null)
        .setIn(['currentWallet', 'lastTransaction'], null);
    case TRANSFER_SUCCESS:
      return state
        .setIn(['currentWallet', 'transfering'], false)
        .setIn(['currentWallet', 'transferError'], null)
        .setIn(['currentWallet', 'lastTransaction'], fromJS(action.transaction))
        .updateIn(['pendingTransactions'], (list) => list.unshift(fromJS(action.transaction)));
    case TRANSFER_ERROR:
      return state
        .setIn(['currentWallet', 'transfering'], false)
        .setIn(['currentWallet', 'transferError'], action.error.message)
        .setIn(['currentWallet', 'lastTransaction'], null);
    case LEDGER_DETECTED:
      return state
        .setIn(['ledgerNanoSInfo', 'status'], 'connected')
        .setIn(['ledgerNanoSInfo', 'id'], action.id)
        .setIn(['errors', 'ledgerError'], null);
    case LEDGER_ERROR:
      return state
        .set('ledgerNanoSInfo', fromJS({ status: 'disconnected', addresses: {} }))
        .setIn(['errors', 'ledgerError'], action.error);
    case SAVE_LEDGER_ADDRESS:
      return state
        .setIn(['wallets', 'hardware', action.name], fromJS(action.newLedgerWallet));
    case FETCHED_LEDGER_ADDRESS:
      return state
        .setIn(['ledgerNanoSInfo', 'addresses', action.derivationPath], action.address);
    case TRANSACTION_CONFIRMED:
      return state
        .updateIn(['confirmedTransactions'], (list) => {
          const pendingTxn = state.get('pendingTransactions').filter((txn) => txn.get('hash') === action.transaction.hash).get(0);
          if (!pendingTxn) {
            return list;
          }
          const confirmedTxn = pendingTxn.set('success', true).set('original', fromJS(action.transaction));
          return list.unshift(fromJS(confirmedTxn));
        })
        .updateIn(['pendingTransactions'], (list) => list.filter((txn) => txn.get('hash') !== action.transaction.hash));
    case DELETE_WALLET:
      return state
        .deleteIn(['wallets', findWalletIndex(state, action.address)]);
    default:
      return state;
  }
}

export default walletHocReducer;

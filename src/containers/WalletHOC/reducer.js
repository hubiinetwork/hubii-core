/*
 *
 * WalletHoc reducer
 *
 */

import { fromJS } from 'immutable';
import { ERC20ABI } from 'utils/wallet';
import abiDecoder from 'abi-decoder';

import {
  LOAD_WALLET_BALANCES,
  LOAD_WALLET_BALANCES_SUCCESS,
  LOAD_WALLET_BALANCES_ERROR,
  UPDATE_TOKEN_BALANCES,
  CREATE_WALLET_FROM_MNEMONIC,
  CREATE_WALLET_FROM_PRIVATE_KEY,
  CREATE_WALLET_SUCCESS,
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
  TRANSACTION_CONFIRMED,
  DELETE_WALLET,
} from './constants';

export const initialState = fromJS({
  selectedWalletName: '',
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
  },
  wallets: [],
  currentWallet: {
    address: '',
  },
  pendingTransactions: [],
  confirmedTransactions: [],
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
        .setIn(['inputs', 'password'], '')
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
      {
        const index = state.get('wallets').findIndex((wallet) => wallet.name === action.name);
        return state
          .setIn(['loading', 'decryptingWallet'], false)
          .setIn(['inputs', 'password'], '')
          .setIn(['wallets', index, 'decrypted', fromJS(action.decryptedWallet)]);
      }
    case DECRYPT_WALLET_FAILURE:
      return state
        .setIn(['loading', 'decryptingWallet'], false)
        .setIn(['errors', 'decryptingWalletError'], action.error);
    case LOAD_WALLET_BALANCES:
      {
        const index = state.get('wallets').findIndex((wallet) => wallet.name === action.name);
        return state
          .setIn(['wallets', index, 'loadingBalances'], true);
      }
    case LOAD_WALLET_BALANCES_SUCCESS:
      {
        const index = state.get('wallets').findIndex((wallet) => wallet.name === action.name);
        return state
          .setIn(['wallets', index, 'loadingBalances'], false)
          .setIn(['wallets', index, 'loadingBalancesError'], null)
          .setIn(['wallets', index, 'balances'], fromJS(action.tokenBalances.tokens || []));
      }
    case LOAD_WALLET_BALANCES_ERROR:
      {
        const index = state.get('wallets').findIndex((wallet) => wallet.name === action.name);
        return state
          .setIn(['wallets', index, 'loadingBalances'], false)
          .setIn(['wallets', index, 'loadingBalancesError'], action.error);
      }
    case UPDATE_TOKEN_BALANCES:
      {
        const index = state.get('wallets').findIndex((wallet) => wallet.name === action.name);
        return state
        .updateIn(['wallets', index, 'balances'], (balances) => balances.map((balance) => {
          if (balance.get('symbol') === action.newBalance.symbol) {
            return balance.set('balance', action.newBalance.balance);
          }
          return balance;
        }));
      }
    case SHOW_DECRYPT_WALLET_MODAL:
      return state
        .setIn(['currentWallet', 'showDecryptModal'], true);
    case HIDE_DECRYPT_WALLET_MODAL:
      return state
        .setIn(['currentWallet', 'showDecryptModal'], false);
    case SET_CURRENT_WALLET:
      return state
        .setIn(['currentWallet', 'name'], action.name)
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
        .removeIn(['wallets', action.walletType, action.name]);
    default:
      return state;
  }
}

export default walletHocReducer;

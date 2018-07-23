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
  LEDGER_CONNECTED,
  LEDGER_DISCONNECTED,
  LEDGER_ETH_CONNECTED,
  LEDGER_ETH_DISCONNECTED,
  LEDGER_ERROR,
  FETCHED_LEDGER_ADDRESS,
  SAVE_LEDGER_ADDRESS,
  TRANSACTION_CONFIRMED,
  DELETE_WALLET,
} from './constants';
import { disconnectedErrorMsg } from '../../utils/ledger/friendlyErrors';

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
    ledgerError: disconnectedErrorMsg,
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
  // hardwareWallets: { ledgerNanoS: { id: null, addresses: {} } },
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
        .setIn(['currentWallet', 'showDecryptModal'], true);
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
    case LEDGER_ETH_CONNECTED:
      return state
        .setIn(['ledgerNanoSInfo', 'status'], 'connected')
        .setIn(['ledgerNanoSInfo', 'id'], action.id)
        .setIn(['errors', 'ledgerError'], null)
        .setIn(['ledgerNanoSInfo', 'ethConnected'], true);
    case LEDGER_ETH_DISCONNECTED:
      return state
        .setIn(['ledgerNanoSInfo', 'status'], 'disconnected')
        .setIn(['ledgerNanoSInfo', 'id'], action.id)
        .setIn(['ledgerNanoSInfo', 'ethConnected'], false);
    case LEDGER_CONNECTED:
      return state
        .setIn(['ledgerNanoSInfo', 'connected'], true)
        .setIn(['ledgerNanoSInfo', 'descriptor'], action.descriptor)
        .setIn(['errors', 'ledgerError'], null);
    case LEDGER_DISCONNECTED:
      return state
        .setIn(['ledgerNanoSInfo', 'ethConnected'], false)
        .setIn(['ledgerNanoSInfo', 'connected'], false)
        .setIn(['ledgerNanoSInfo', 'descriptor'], null);
        // .setIn(['errors', 'ledgerError'], 'ledger disconnected')
    case LEDGER_ERROR:
      return state
        .setIn(['ledgerNanoSInfo', 'status'], 'disconnected')
        .setIn(['ledgerNanoSInfo', 'addresses'], fromJS({}))
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

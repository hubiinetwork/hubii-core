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
  LOAD_SUPPORTED_TOKENS,
  LOAD_SUPPORTED_TOKENS_SUCCESS,
  LOAD_SUPPORTED_TOKENS_ERROR,
  LOAD_PRICES_SUCCESS,
  LOAD_PRICES_ERROR,
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
  TREZOR_CONNECTED,
  TREZOR_DISCONNECTED,
  FETCHED_TREZOR_ADDRESS,
  TREZOR_ERROR,
  DELETE_WALLET,
  LOAD_TRANSACTIONS_SUCCESS,
  LOAD_TRANSACTIONS_ERROR,
  LOAD_BLOCK_HEIGHT_ERROR,
  LOAD_BLOCK_HEIGHT_SUCCESS,
} from './constants';
import { disconnectedErrorMsg, trezorDisconnectedErrorMsg } from '../../utils/friendlyErrors';

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
    trezorError: trezorDisconnectedErrorMsg,
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
  trezorInfo: {
    status: 'disconnected',
    addresses: {},
    id: null,
  },
  pendingTransactions: [],
  supportedAssets: {
    loading: true,
    error: null,
    assets: [],
  },
  prices: {
    loading: true,
    error: null,
    assets: [],
  },
  transactions: {},
  balances: {},
  currentDecryptionCallback: null,
  blockHeight: {
    loading: true,
    error: null,
    height: -1,
  },
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
        .setIn(['balances', action.address], state.getIn(['balances', action.address]) || fromJS({ loading: true }));
    case LOAD_WALLET_BALANCES_SUCCESS:
      return state
        .setIn(['balances', action.address, 'loading'], false)
        .setIn(['balances', action.address, 'error'], null)
        .setIn(['balances', action.address, 'assets'], fromJS(action.assets || []));
    case LOAD_WALLET_BALANCES_ERROR:
      return state
        .setIn(['balances', action.address, 'loading'], false)
        .setIn(['balances', action.address, 'error'], action.error);
    case LOAD_SUPPORTED_TOKENS:
      return state
        .setIn(['supportedAssets', 'loading'], true)
        .setIn(['supportedAssets', 'error'], null);
    case LOAD_SUPPORTED_TOKENS_SUCCESS:
      return state
        .setIn(['supportedAssets', 'loading'], false)
        .setIn(['supportedAssets', 'error'], null)
        .setIn(['supportedAssets', 'assets'], fromJS(action.assets));
    case LOAD_SUPPORTED_TOKENS_ERROR:
      return state
        .setIn(['supportedAssets', 'loading'], false)
        .setIn(['supportedAssets', 'error'], action.error);
    case LOAD_PRICES_SUCCESS:
      return state
        .setIn(['prices', 'loading'], false)
        .setIn(['prices', 'error'], null)
        .setIn(['prices', 'assets'], fromJS(action.prices));
    case LOAD_PRICES_ERROR:
      return state
        .setIn(['prices', 'error'], action.error);
    case LOAD_TRANSACTIONS_SUCCESS:
      return state
        .setIn(['transactions', action.address, 'loading'], false)
        .setIn(['transactions', action.address, 'error'], null)
        .setIn(['transactions', action.address, 'transactions'], fromJS(action.transactions || []));
    case LOAD_TRANSACTIONS_ERROR:
      return state
        .setIn(['transactions', action.address, 'loading'], false)
        .setIn(['transactions', action.address, 'error'], action.error)
        .setIn(['transactions', action.address, 'transactions'], fromJS([]));
    case SHOW_DECRYPT_WALLET_MODAL:
      return state
        .setIn(['currentWallet', 'showDecryptModal'], true)
        .set('currentDecryptionCallback', fromJS(action.callbackAction));
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
        .setIn(['ledgerNanoSInfo', 'descriptor'], action.descriptor);
    case LEDGER_DISCONNECTED:
      return state
        .setIn(['ledgerNanoSInfo', 'status'], 'disconnected')
        .setIn(['ledgerNanoSInfo', 'ethConnected'], false)
        .setIn(['ledgerNanoSInfo', 'connected'], false)
        .setIn(['ledgerNanoSInfo', 'descriptor'], null);
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
    case TREZOR_CONNECTED:
      return state
        .setIn(['trezorInfo', 'status'], 'connected')
        .setIn(['trezorInfo', 'id'], action.deviceId)
        .setIn(['errors', 'trezorError'], null);
    case TREZOR_DISCONNECTED:
      return state
        .setIn(['trezorInfo', 'status'], 'disconnected')
        .setIn(['trezorInfo', 'id'], null);
    case FETCHED_TREZOR_ADDRESS:
      return state
        .setIn(['trezorInfo', 'addresses', action.derivationPath], action.address);
    case TREZOR_ERROR:
      return state
        .setIn(['trezorInfo', 'status'], 'disconnected')
        .setIn(['trezorInfo', 'addresses'], fromJS({}))
        .setIn(['errors', 'trezorError'], action.error);
    case DELETE_WALLET:
      return state
        .deleteIn(['wallets', findWalletIndex(state, action.address)]);
    case LOAD_BLOCK_HEIGHT_SUCCESS:
      return state
        .setIn(['blockHeight', 'loading'], false)
        .setIn(['blockHeight', 'error'], null)
        .setIn(['blockHeight', 'height'], action.blockHeight);
    case LOAD_BLOCK_HEIGHT_ERROR:
      return state
        .setIn(['blockHeight', 'loading'], false)
        .setIn(['blockHeight', 'error'], action.error);
    default:
      return state;
  }
}

export default walletHocReducer;

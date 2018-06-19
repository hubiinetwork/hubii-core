/*
 *
 * WalletManager reducer
 *
 */

import { fromJS } from 'immutable';
import {
  CREATE_NEW_WALLET_SUCCESS,
  CREATE_NEW_WALLET,
  CREATE_NEW_WALLET_FAILURE,
  DECRYPT_WALLET,
  DECRYPT_WALLET_FAILURE,
  DECRYPT_WALLET_SUCCESS,
  UPDATE_PROGRESS,
} from './constants';

const initialState = fromJS({
  selectedWalletName: '',
  inputs: {
    password: '',
    newWalletName: 'My Wallet',
    derivationPath: 'm/44\'/60\'/0\'/0/0',
  },
  loading: {
    creatingWallet: false,
    decryptingWallet: false,
  },
  errors: {
    creatingWalletError: null,
    decryptingWalletError: null,
  },
  wallets: {
    software: {},
    hardware: {},
  },
  progress: 0,
});

function walletManagerReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_NEW_WALLET:
      return state
        .setIn(['loading', 'creatingWallet'], true)
        .set('progress', 0);
    case CREATE_NEW_WALLET_SUCCESS:
      return state
        .setIn(['loading', 'creatingWallet'], false)
        .setIn(['inputs', 'password'], '')
        .setIn(['errors', 'creatingWalletError'], null)
        .setIn(['wallets', 'software', action.newWalletName], fromJS(action.newWallet));
    case CREATE_NEW_WALLET_FAILURE:
      return state
        .setIn(['loading', 'creatingWallet'], false)
        .setIn(['errors', 'creatingWalletError'], action.error);
    case DECRYPT_WALLET:
      return state
        .setIn(['loading', 'decryptingWallet'], true)
        .set('progress', 0);
    case DECRYPT_WALLET_SUCCESS:
      return state
        .setIn(['loading', 'decryptingWallet'], false)
        .setIn(['inputs', 'password'], '')
        .setIn(['errors', 'decryptingWalletError'], null)
        .setIn(['wallets', state.get('selectedWallet'), 'decrypted'], action.decryptedWallet);
    case DECRYPT_WALLET_FAILURE:
      return state
        .setIn(['loading', 'decryptingWallet'], false)
        .setIn(['errors', 'decryptingWalletError'], action.error);
    case UPDATE_PROGRESS:
      return state
        .set('progress', action.percent);
    default:
      return state;
  }
}

export default walletManagerReducer;

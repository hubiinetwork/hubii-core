/*
 *
 * WalletHoc reducer
 *
 */

import { fromJS } from 'immutable';
import { ERC20ABI, findWalletIndex } from 'utils/wallet';
import abiDecoder from 'abi-decoder';

import { CHANGE_NETWORK } from 'containers/App/constants';
import {
  MAKE_NAHMII_PAYMENT,
  MAKE_NAHMII_PAYMENT_SUCCESS,
  MAKE_NAHMII_PAYMENT_ERROR,
} from 'containers/NahmiiHoc/constants';

import {
  CREATE_WALLET_FROM_MNEMONIC,
  CREATE_WALLET_FROM_PRIVATE_KEY,
  CREATE_WALLET_SUCCESS,
  UPDATE_WALLET_NAME_SUCCESS,
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
  DELETE_WALLET,
  LOCK_WALLET,
  DRAG_WALLET,
  TOGGLE_FOLD_WALLET,
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
  },
  wallets: [],
  currentWallet: {
    address: '',
  },
  currentDecryptionCallback: null,
});

abiDecoder.addABI(ERC20ABI);

function walletHocReducer(state = initialState, action) {
  switch (action.type) {
    case DRAG_WALLET: {
      state.get('wallets').toJS().forEach((w) => {
        if (action.newWallets.findIndex((r) => r.name === w.name) === -1) {
          throw new Error('Invalid DRAG_WALLET action payload');
        }
      });
      return state.set('wallets', fromJS(action.newWallets));
    }
    case TOGGLE_FOLD_WALLET: {
      return state.setIn(
        ['wallets', findWalletIndex(state, action.address), 'folded'],
        !state.getIn(['wallets', findWalletIndex(state, action.address), 'folded'])
      );
    }
    case CREATE_WALLET_FROM_MNEMONIC:
    case CREATE_WALLET_FROM_PRIVATE_KEY:
      return state
        .setIn(['loading', 'creatingWallet'], true)
        .setIn(['errors', 'creatingWalletError'], null);
    case CREATE_WALLET_SUCCESS:
      return state
        .setIn(['loading', 'creatingWallet'], false)
        .setIn(['inputs', 'password'], '');
    case UPDATE_WALLET_NAME_SUCCESS:
      return state
        .setIn(['wallets', findWalletIndex(state, action.address), 'name'], action.newWalletName);
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
    case MAKE_NAHMII_PAYMENT:
      return state
        .setIn(['currentWallet', 'transfering'], true)
        .setIn(['currentWallet', 'transferError'], null)
        .setIn(['currentWallet', 'lastTransaction'], null);
    case TRANSFER_SUCCESS:
    case MAKE_NAHMII_PAYMENT_SUCCESS:
      return state
        .setIn(['currentWallet', 'transfering'], false)
        .setIn(['currentWallet', 'transferError'], null);
    case TRANSFER_ERROR:
    case MAKE_NAHMII_PAYMENT_ERROR:
      return state
        .setIn(['currentWallet', 'transfering'], false)
        .setIn(['currentWallet', 'transferError'], action.error.message)
        .setIn(['currentWallet', 'lastTransaction'], null);
    case DELETE_WALLET:
      return state
        .deleteIn(['wallets', findWalletIndex(state, action.address)]);
    case LOCK_WALLET:
      return state
        .deleteIn(['wallets', findWalletIndex(state, action.address), 'decrypted']);
    case CHANGE_NETWORK:
      return state
        .set('prices', initialState.get('prices'))
        .set('supportedAssets', initialState.get('supportedAssets'))
        .set('transactions', initialState.get('transactions'))
        .set('balances', initialState.get('balances'))
        .set('blockHeight', initialState.get('blockHeight'));
    default:
      return state;
  }
}

export default walletHocReducer;

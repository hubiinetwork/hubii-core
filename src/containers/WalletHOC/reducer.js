/*
 *
 * WalletManager reducer
 *
 */

import { fromJS } from 'immutable';
import { ERC20ABI } from 'utils/wallet';
import { utils } from 'ethers';
import abiDecoder from 'abi-decoder';

import {
  LOAD_WALLETS_SUCCESS,
  LOAD_WALLET_BALANCES,
  LOAD_WALLET_BALANCES_SUCCESS,
  LOAD_WALLET_BALANCES_ERROR,
  CREATE_NEW_WALLET_SUCCESS,
  CREATE_NEW_WALLET,
  CREATE_NEW_WALLET_FAILURE,
  DECRYPT_WALLET,
  DECRYPT_WALLET_FAILURE,
  DECRYPT_WALLET_SUCCESS,
  SET_CURRENT_WALLET,
  SHOW_DECRYPT_WALLET_MODAL,
  HIDE_DESCRYPT_WALLET_MODAL,
  TRANSFER,
  TRANSFER_SUCCESS,
  TRANSFER_ERROR,
  TRANSACTION_CONFIRMED,
} from './constants';

const initialState = fromJS({
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
  wallets: {
    software: {},
    hardware: {},
  },
  currentWallet: {
    address: '',
  },
  pendingTransactions: [],
  confirmedTransactions: [],
});

abiDecoder.addABI(ERC20ABI);

function walletManagerReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_NEW_WALLET:
      return state
        .setIn(['loading', 'creatingWallet'], true)
        .setIn(['errors', 'creatingWalletError'], null)
        .set('progress', 0);
    case CREATE_NEW_WALLET_SUCCESS:
      return state
        .setIn(['loading', 'creatingWallet'], false)
        .setIn(['inputs', 'password'], '')
        .setIn(['wallets', 'software', action.name], fromJS(action.newWallet));
    case CREATE_NEW_WALLET_FAILURE:
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
        .setIn(['wallets', 'software', action.name, 'decrypted'], action.decryptedWallet);
    case DECRYPT_WALLET_FAILURE:
      return state
        .setIn(['loading', 'decryptingWallet'], false)
        .setIn(['errors', 'decryptingWalletError'], action.error);
    case LOAD_WALLETS_SUCCESS:
      return state
        .set('wallets', fromJS(action.wallets));
    case LOAD_WALLET_BALANCES:
      return state
        .setIn(['wallets', 'software', action.name, 'loadingBalances'], true);
    case LOAD_WALLET_BALANCES_SUCCESS:
      return state
        .setIn(['wallets', 'software', action.name, 'loadingBalances'], false)
        .setIn(['wallets', 'software', action.name, 'loadingBalancesError'], null)
        .setIn(['wallets', 'software', action.name, 'balances'], fromJS(action.tokenBalances.tokens || []));
    case LOAD_WALLET_BALANCES_ERROR:
      return state
        .setIn(['wallets', 'software', action.name, 'loadingBalances'], false)
        .setIn(['wallets', 'software', action.name, 'loadingBalancesError'], action.error);
    case SHOW_DECRYPT_WALLET_MODAL:
      return state
        .setIn(['currentWallet', 'showDecryptModal'], true);
    case HIDE_DESCRYPT_WALLET_MODAL:
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
        .updateIn(['pendingTransactions'], (list) => {
          const transaction = action.transaction;
          const formatedTransaction = {
            timestamp: new Date().getTime(),
            token: action.token,
            from: transaction.from,
            to: transaction.to,
            hash: transaction.hash,
            value: transaction.value,
            input: transaction.data,
            original: transaction,
          };
          if (action.token !== 'ETH') {
            const inputData = abiDecoder.decodeMethod(transaction.data);
            const toAddress = inputData.params.find((param) => param.name === '_to');
            const tokens = inputData.params.find((param) => param.name === '_tokens');
            const wei = utils.bigNumberify(tokens.value);
            formatedTransaction.to = toAddress.value;
            formatedTransaction.value = parseFloat(utils.formatEther(wei));
          }
          return list.insert(1, fromJS(formatedTransaction));
        });
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
          return list.insert(1, confirmedTxn);
        })
        .updateIn(['pendingTransactions'], (list) => list.filter((txn) => txn.get('hash') !== action.transaction.hash));
    default:
      return state;
  }
}

export default walletManagerReducer;

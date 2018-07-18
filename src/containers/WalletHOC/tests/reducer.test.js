
import { fromJS } from 'immutable';
import walletHocReducer from '../reducer';
import {
  createWalletFromMnemonic,
  createWalletFailed,
  createWalletSuccess,
  decryptWallet,
  decryptWalletSuccess,
  loadWalletBalances,
  loadWalletBalancesSuccess,
  loadWalletBalancesError,
  loadPrices,
  loadSupportedTokens,
  setCurrentWallet,
  transferError,
  transfer,
  showDecryptWalletModal,
  hideDecryptWalletModal,
  ledgerDetected,
  deleteWallet,
  addNewWallet,
} from '../actions';

import { LEDGER_ERROR, FETCHED_LEDGER_ADDRESS } from '../constants';

const wallet = {
  name: 'testwallet',
  address: '0x00',
};

describe('walletHocReducer', () => {
  let state;
  let stateWithWallet;
  beforeEach(() => {
    state = fromJS({
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
      supportedTokens: {
        loading: false,
        error: null,
        tokens: [],
      },
      prices: {
        loading: false,
        error: null,
        tokens: [],
      },
      balances: {},
    });
    stateWithWallet = state.setIn(['wallets', 0], fromJS(wallet));
  });

  it('returns the initial state', () => {
    expect(walletHocReducer(undefined, {})).toEqual(state);
  });

  describe('Ledger Nano S reducers', () => {
    it('should handle LEDGER_DETECTED action correctly', () => {
      const id = '893745sjdfhks83';
      const expected = state
          .setIn(['ledgerNanoSInfo', 'status'], 'connected')
          .setIn(['ledgerNanoSInfo', 'id'], id)
          .setIn(['errors', 'ledgerError'], null);
      expect(walletHocReducer(state, ledgerDetected(id))).toEqual(expected);
    });

    it('should handle LEDGER_ERROR action correctly', () => {
      const error = 'oh no!';
      const expected = state
        .set('ledgerNanoSInfo', fromJS({ status: 'disconnected', addresses: {} }))
        .setIn(['errors', 'ledgerError'], error);
      expect(walletHocReducer(state, { type: LEDGER_ERROR, error })).toEqual(expected);
    });

    it('should handle FETCHED_LEDGER_ADDRESS action correctly', () => {
      const derivationPath = 'm01201010';
      const address = '0x0000000000000';
      const expected = state
          .setIn(['ledgerNanoSInfo', 'addresses', derivationPath], address);
      expect(walletHocReducer(state, { type: FETCHED_LEDGER_ADDRESS, address, derivationPath })).toEqual(expected);
    });
  });

  describe('software wallet lifecycle reducers', () => {
    it('should handle deleteWallet action correctly', () => {
      const expected = stateWithWallet
      .deleteIn(['wallets', 0]);
      expect(walletHocReducer(stateWithWallet, deleteWallet('0x00'))).toEqual(expected);
    });

    it('should handle createWalletFromMnemonic action correctly', () => {
      const expected = state
      .setIn(['loading', 'creatingWallet'], true)
      .setIn(['errors', 'creatingWalletError'], null);
      expect(walletHocReducer(state, createWalletFromMnemonic())).toEqual(expected);
    });

    it('should handle addNewWallet action correctly', () => {
      const encrypted = JSON.stringify({ address: 123 });
      const decrypted = { key: 43 };
      const name = 'Henry';
      const newWallet = { name, address: '0x123', type: 'software', encrypted, decrypted };
      const expected = state
        .set('wallets', state
          .get('wallets')
          .push(fromJS(newWallet))
        );
      expect(walletHocReducer(
      state,
      addNewWallet(newWallet)))
      .toEqual(expected);
    });

    it('should handle CREATE_WALLET_SUCCESS type correctly', () => {
      const initState = state
      .setIn(['loading', 'creatingWallet'], true)
      .setIn(['inputs', 'password'], 'test');
      const expected = state
      .setIn(['loading', 'creatingWallet'], false)
      .setIn(['inputs', 'password'], '');
      expect(walletHocReducer(
      initState,
      createWalletSuccess('', '{"address":"123"}', { address: '0x00' })))
      .toEqual(expected);
    });


    it('should handle createWalletFailed action correctly', () => {
      const error = 'error 1';
      const expected = state
      .setIn(['loading', 'creatingWallet'], false)
      .setIn(['errors', 'creatingWalletError'], error);
      expect(walletHocReducer(state, createWalletFailed(error))).toEqual(expected);
    });

    it('should handle decryptWallet action correctly', () => {
      const expected = state
      .setIn(['loading', 'decryptingWallet'], true)
      .set('progress', 0);
      expect(walletHocReducer(state, decryptWallet())).toEqual(expected);
    });

    it('should handle createWalletFailed action correctly', () => {
      const error = 'error 1';
      const expected = state
        .setIn(['loading', 'creatingWallet'], false)
        .setIn(['errors', 'creatingWalletError'], error);
      expect(walletHocReducer(state, createWalletFailed(error))).toEqual(expected);
    });

    it('should handle decryptWalletSuccess action correctly', () => {
      const address = '0x00';
      const decryptedWallet = { address: '0x00', id: 1234 };
      const expected = stateWithWallet
      .setIn(['loading', 'decryptingWallet'], false)
      .setIn(['inputs', 'password'], '')
      .setIn(['wallets', 0, 'decrypted'], fromJS(decryptedWallet));
      expect(walletHocReducer(stateWithWallet, decryptWalletSuccess(address, decryptedWallet))).toEqual(expected);
    });

    it('should handle decryptWallet action correctly', () => {
      const expected = state
        .setIn(['loading', 'decryptingWallet'], true)
        .set('progress', 0);
      expect(walletHocReducer(state, decryptWallet())).toEqual(expected);
    });
  });

  describe('balances', () => {
    it('load wallet balances', () => {
      const address = '0x00';
      const expected = stateWithWallet
        .setIn(['balances', address, 'loading'], true);

      expect(walletHocReducer(stateWithWallet, loadWalletBalances(address))).toEqual(expected);
    });
    it('load wallet balances success', () => {
      const address = '0x00';
      const balances = [];
      const expected = stateWithWallet
        .setIn(['balances', address, 'loading'], false)
        .setIn(['balances', address, 'error'], null)
        .setIn(['balances', address, 'tokens'], fromJS(balances));

      expect(walletHocReducer(stateWithWallet, loadWalletBalancesSuccess(address, balances))).toEqual(expected);
    });
    it('should default to empty array if token property is null', () => {
      const address = '0x00';
      const balances = null;
      const expected = stateWithWallet
        .setIn(['balances', address, 'loading'], false)
        .setIn(['balances', address, 'error'], null)
        .setIn(['balances', address, 'tokens'], fromJS([]));

      expect(walletHocReducer(stateWithWallet, loadWalletBalancesSuccess(address, balances))).toEqual(expected);
    });
    it('load wallet balances error', () => {
      const address = '0x00';
      const error = new Error();
      const expected = stateWithWallet
        .setIn(['balances', address, 'loading'], false)
        .setIn(['balances', address, 'error'], error);

      expect(walletHocReducer(stateWithWallet, loadWalletBalancesError(address, error))).toEqual(expected);
    });
  });

  describe('supported tokens', () => {
    it('load supported tokens', () => {
      const expected = stateWithWallet
        .setIn(['supportedTokens', 'loading'], true);

      expect(walletHocReducer(stateWithWallet, loadSupportedTokens())).toEqual(expected);
    });
  });

  describe('prices', () => {
    it('load prices', () => {
      const expected = stateWithWallet
        .setIn(['prices', 'loading'], true);

      expect(walletHocReducer(stateWithWallet, loadPrices())).toEqual(expected);
    });
  });

  describe('currentWallet', () => {
    it('SET_CURRENT_WALLET', () => {
      const address = 'abcd';
      const currentWallet = {
        address,
        transfering: false,
        transferError: null,
        lastTransaction: null,
      };
      const expected = state
          .set('currentWallet', fromJS(currentWallet));

      expect(walletHocReducer(state, setCurrentWallet(address))).toEqual(expected);
    });
    it('TRANSFER', () => {
      const currentWallet = {
        address: '',
        transfering: true,
        transferError: null,
        lastTransaction: null,
      };
      const expected = state
          .set('currentWallet', fromJS(currentWallet));

      expect(walletHocReducer(state, transfer({}))).toEqual(expected);
    });
    it('TRANSFER_ERROR', () => {
      const error = { message: 'error' };
      const currentWallet = {
        address: '',
        transfering: false,
        transferError: error.message,
        lastTransaction: null,
      };
      const expected = state
          .set('currentWallet', fromJS(currentWallet));

      expect(walletHocReducer(state, transferError(error))).toEqual(expected);
    });
    it('SHOW_DECRYPT_WALLET_MODAL', () => {
      const currentWallet = {
        address: '',
        showDecryptModal: true,
      };
      const expected = state
          .set('currentWallet', fromJS(currentWallet));

      expect(walletHocReducer(state, showDecryptWalletModal())).toEqual(expected);
    });
    it('HIDE_DECRYPT_WALLET_MODAL', () => {
      const currentWallet = {
        address: '',
        showDecryptModal: false,
      };
      const expected = state
          .set('currentWallet', fromJS(currentWallet));

      expect(walletHocReducer(state, hideDecryptWalletModal())).toEqual(expected);
    });
  });
});

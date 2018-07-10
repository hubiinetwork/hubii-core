
import { fromJS } from 'immutable';
import walletHocReducer from '../reducer';
import {
  createWalletFromMnemonic,
  createWalletFailed,
  createWalletSuccess,
  decryptWallet,
  decryptWalletFailed,
  decryptWalletSuccess,
  loadWalletBalances,
  loadWalletBalancesSuccess,
  loadWalletBalancesError,
  setCurrentWallet,
  transferError,
  transfer,
  showDecryptWalletModal,
  hideDecryptWalletModal,
  deleteWallet,
} from '../actions';
describe('walletHocReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
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
  });

  describe('removeWallet', () => {
    it('should remove a wallet', () => {
      const wallet = {
        123: {
          address: '0x324234',
        },
      };
      const expected = { ...state };
      state.set('wallets', fromJS(wallet));
      expect(walletHocReducer(state, deleteWallet(wallet))).toEqual(expected);
    });
  });

  it('returns the initial state', () => {
    expect(walletHocReducer(undefined, {})).toEqual(state);
  });

  it('should handle createWalletFromMnemonic action correctly', () => {
    const expected = state
      .setIn(['loading', 'creatingWallet'], true)
      .setIn(['errors', 'creatingWalletError'], null);
    expect(walletHocReducer(state, createWalletFromMnemonic())).toEqual(expected);
  });

  it('should handle createWalletSuccess action correctly', () => {
    const encryptedWallet = { id: 123 };
    const decryptedWallet = { key: 43 };
    const name = 'Henry';
    const type = 'software';
    const index = state.get('wallets').findIndex((wallet) => wallet.get('name') === name);
    const expected = state
      .setIn(['loading', 'creatingWallet'], false)
      .setIn(['inputs', 'password'], '')
      .setIn(['errors', 'creatingWalletError'], null)
      .setIn(['wallets', index],
        fromJS({ name, type, encrypted: encryptedWallet, decrypted: decryptedWallet }));
    expect(walletHocReducer(
      state,
      createWalletSuccess(
        name,
        encryptedWallet,
        decryptedWallet)))
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

  it('should handle decryptWalletSuccess action correctly', () => {
    const decryptedWallet = { id: 1234 };
    const name = 'test';
    const index = state.get('wallets').findIndex((wallet) => wallet.get('name') === name);
    const expected = state
          .setIn(['loading', 'decryptingWallet'], false)
          .setIn(['inputs', 'password'], '')
          .setIn(['wallets', index, 'decrypted', fromJS(decryptedWallet)]);
    expect(walletHocReducer(state, decryptWalletSuccess(name, decryptedWallet))).toEqual(expected);
  });

  it('should handle decryptWalletFailed action correctly', () => {
    const error = 'error 1';
    const expected = state
      .setIn(['loading', 'decryptingWallet'], false)
      .setIn(['errors', 'decryptingWalletError'], error);
    expect(walletHocReducer(state, decryptWalletFailed(error))).toEqual(expected);
  });

  describe('balances', () => {
    it('load wallet balances', () => {
      const wallets = [{ name: 'testWallet', encrypted: '{"address": "abcd1"}' }, { name: 'test2', encrypted: '{"address": "abcd2"}' }];
      const loading = true;
      const walletName = 'testWallet';
      const testState = state.set('wallets', fromJS(wallets));
      const index = testState.get('wallets').findIndex((wallet) => wallet.get('name') === walletName);
      const expected = testState
          .setIn(['wallets', index, 'loadingBalances'], loading);

      expect(walletHocReducer(testState, loadWalletBalances(walletName, 'test'))).toEqual(expected);
    });
    it('load wallet balances success', () => {
      const wallets = [{ name: 'testWallet', encrypted: '{"address": "abcd1"}' }, { name: 'test2', encrypted: '{"address": "abcd2"}' }];
      const balances = { tokenBalances: { tokens: [] } };
      const walletName = 'testWallet';
      const testState = state.set('wallets', fromJS(wallets));
      const index = testState.get('wallets').findIndex((wallet) => wallet.get('name') === walletName);
      const expected = testState
          .setIn(['wallets', index, 'loadingBalances'], false)
          .setIn(['wallets', index, 'loadingBalancesError'], null)
          .setIn(['wallets', index, 'balances'], fromJS(balances.tokenBalances.tokens));

      expect(walletHocReducer(testState, loadWalletBalancesSuccess(walletName, balances.tokenBalances))).toEqual(expected);
    });
    it('should default to empty array if token property is null', () => {
      const wallets = [{ name: 'testWallet', encrypted: '{"address": "abcd1"}' }, { name: 'test2', encrypted: '{"address": "abcd2"}' }];
      const balances = { tokenBalances: {} };
      const walletName = 'testWallet';
      const testState = state.set('wallets', fromJS(wallets));
      const index = testState.get('wallets').findIndex((wallet) => wallet.get('name') === walletName);
      const expected = testState
          .set('wallets', fromJS(wallets))
          .setIn(['wallets', index, 'loadingBalances'], false)
          .setIn(['wallets', index, 'loadingBalancesError'], null)
          .setIn(['wallets', index, 'balances'], fromJS([]));

      expect(walletHocReducer(testState, loadWalletBalancesSuccess(walletName, balances.tokenBalances))).toEqual(expected);
    });
    it('load wallet balances error', () => {
      const wallets = [{ name: 'testWallet', encrypted: '{"address": "abcd1"}' }, { name: 'test2', encrypted: '{"address": "abcd2"}' }];
      const error = new Error();
      const walletName = 'testWallet';
      const testState = state.set('wallets', fromJS(wallets));
      const index = testState.get('wallets').findIndex((wallet) => wallet.get('name') === walletName);
      const expected = testState
          .setIn(['wallets', index, 'loadingBalances'], false)
          .setIn(['wallets', index, 'loadingBalancesError'], error);

      expect(walletHocReducer(testState, loadWalletBalancesError(walletName, error))).toEqual(expected);
    });
  });

  describe('currentWallet', () => {
    it('SET_CURRENT_WALLET', () => {
      const walletName = 'testWallet';
      const address = 'abcd';
      const currentWallet = {
        address,
        name: walletName,
        transfering: false,
        transferError: null,
        lastTransaction: null,
      };
      const expected = state
          .set('currentWallet', fromJS(currentWallet));

      expect(walletHocReducer(state, setCurrentWallet(walletName, address))).toEqual(expected);
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

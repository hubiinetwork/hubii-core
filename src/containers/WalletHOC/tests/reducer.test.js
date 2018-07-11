
import { fromJS } from 'immutable';
import walletHocReducer from '../reducer';
import { findWalletIndex } from '../../../utils/wallet';
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

const wallet = {
  name: 'testwallet',
  address: '0x00',
};

describe('walletHocReducer', () => {
  let state;
  let stateWithWallet;
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
    stateWithWallet = state.setIn(['wallets', 0], fromJS(wallet));
  });

  it('returns the initial state', () => {
    expect(walletHocReducer(undefined, {})).toEqual(state);
  });

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

  it('should handle createWalletSuccess action correctly', () => {
    const encrypted = JSON.stringify({ address: 123 });
    const decrypted = { key: 43 };
    const name = 'Henry';
    const newWallet = { name, address: '0x123', type: 'software', encrypted, decrypted };
    const expected = state
      .setIn(['loading', 'creatingWallet'], false)
      .setIn(['inputs', 'password'], '')
        .set('wallets', state
          .get('wallets')
          .push(fromJS(newWallet))
        );
    expect(walletHocReducer(
      state,
      createWalletSuccess(
        name,
        encrypted,
        decrypted)))
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
    const decryptedWallet = { address: '0x00', id: 1234 };
    const expected = stateWithWallet
      .setIn(['loading', 'decryptingWallet'], false)
      .setIn(['inputs', 'password'], '')
      .setIn(['wallets', 0, 'decrypted', fromJS(decryptedWallet)]);
    expect(walletHocReducer(stateWithWallet, decryptWalletSuccess(decryptedWallet))).toEqual(expected);
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
      const address = '0x00';
      const expected = stateWithWallet
        .setIn(['wallets', findWalletIndex(stateWithWallet, address), 'loadingBalances'], true);

      expect(walletHocReducer(stateWithWallet, loadWalletBalances(address))).toEqual(expected);
    });
    it('load wallet balances success', () => {
      const address = '0x00';
      const balances = { tokenBalances: { tokens: [] } };
      const expected = stateWithWallet
        .setIn(['wallets', findWalletIndex(stateWithWallet, address), 'loadingBalances'], false)
        .setIn(['wallets', findWalletIndex(stateWithWallet, address), 'loadingBalancesError'], null)
        .setIn(['wallets', findWalletIndex(stateWithWallet, address), 'balances'], fromJS(balances.tokenBalances.tokens || []));

      expect(walletHocReducer(stateWithWallet, loadWalletBalancesSuccess(address, balances.tokenBalances))).toEqual(expected);
    });
    it('should default to empty array if token property is null', () => {
      const address = '0x00';
      const balances = { tokenBalances: {} };
      const expected = stateWithWallet
        .setIn(['wallets', findWalletIndex(stateWithWallet, address), 'loadingBalances'], false)
        .setIn(['wallets', findWalletIndex(stateWithWallet, address), 'loadingBalancesError'], null)
        .setIn(['wallets', findWalletIndex(stateWithWallet, address), 'balances'], fromJS([]));

      expect(walletHocReducer(stateWithWallet, loadWalletBalancesSuccess(address, balances.tokenBalances))).toEqual(expected);
    });
    it('load wallet balances error', () => {
      const address = '0x00';
      const error = new Error();
      const expected = stateWithWallet
        .setIn(['wallets', findWalletIndex(stateWithWallet, address), 'loadingBalances'], false)
        .setIn(['wallets', findWalletIndex(stateWithWallet, address), 'loadingBalancesError'], error);

      expect(walletHocReducer(stateWithWallet, loadWalletBalancesError(address, error))).toEqual(expected);
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

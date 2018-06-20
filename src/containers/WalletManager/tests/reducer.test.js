
import { fromJS } from 'immutable';
import walletManagerReducer from '../reducer';
import {
  createNewWallet,
  createNewWalletFailed,
  createNewWalletSuccess,
  decryptWallet,
  decryptWalletFailed,
  decryptWalletSuccess,
  updateProgress,
} from '../actions';
describe('walletManagerReducer', () => {
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
      wallets: {
        software: {},
        hardware: {},
      },
      progress: 0,
    });
  });

  it('returns the initial state', () => {
    expect(walletManagerReducer(undefined, {})).toEqual(state);
  });

  it('should handle createNewWallet action correctly', () => {
    const expected = state
      .setIn(['loading', 'creatingWallet'], true)
      .set('progress', 0);
    expect(walletManagerReducer(state, createNewWallet())).toEqual(expected);
  });

  it('should handle createNewWalletSuccess action correctly', () => {
    const encryptedWallet = { id: 123 };
    const decryptedWallet = { key: 43 };
    const name = 'Henry';
    const expected = state
      .setIn(['loading', 'creatingWallet'], false)
      .setIn(['inputs', 'password'], '')
      .setIn(['errors', 'creatingWalletError'], null)
      .setIn(['wallets', 'software', name],
        fromJS({ encrypted: encryptedWallet, decrypted: decryptedWallet }));
    expect(walletManagerReducer(
      state,
      createNewWalletSuccess(
        name,
        encryptedWallet,
        decryptedWallet)))
      .toEqual(expected);
  });

  it('should handle createNewWalletFailed action correctly', () => {
    const error = 'error 1';
    const expected = state
      .setIn(['loading', 'creatingWallet'], false)
      .setIn(['errors', 'creatingWalletError'], error);
    expect(walletManagerReducer(state, createNewWalletFailed(error))).toEqual(expected);
  });

  it('should handle decryptWallet action correctly', () => {
    const expected = state
      .setIn(['loading', 'decryptingWallet'], true)
      .set('progress', 0);
    expect(walletManagerReducer(state, decryptWallet())).toEqual(expected);
  });

  it('should handle decryptWalletSuccess action correctly', () => {
    const decryptedWallet = { id: 1234 };
    const expected = state
      .setIn(['loading', 'decryptingWallet'], false)
      .setIn(['inputs', 'password'], '')
      .setIn(['errors', 'decryptingWalletError'], null)
      .setIn(['wallets', state.get('selectedWallet'), 'decrypted'], decryptedWallet);
    expect(walletManagerReducer(state, decryptWalletSuccess(decryptedWallet))).toEqual(expected);
  });

  it('should handle decryptWalletFailed action correctly', () => {
    const error = 'error 1';
    const expected = state
      .setIn(['loading', 'decryptingWallet'], false)
      .setIn(['errors', 'decryptingWalletError'], error);
    expect(walletManagerReducer(state, decryptWalletFailed(error))).toEqual(expected);
  });

  it('should handle updateProgress action correctly', () => {
    const percent = 13;
    const expected = state
    .set('progress', percent);
    expect(walletManagerReducer(state, updateProgress(percent))).toEqual(expected);
  });
});

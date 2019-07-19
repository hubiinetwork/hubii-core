import { fromJS } from 'immutable';
import { findWalletIndex } from 'utils/wallet';

import {
  makeNahmiiPayment,
  nahmiiPaymentError,
  nahmiiPaymentSuccess,
} from 'containers/NahmiiHoc/actions';

import walletHocReducer from '../reducer';
import {
  createWalletFromMnemonic,
  createWalletFailed,
  createWalletSuccess,
  decryptWallet,
  decryptWalletSuccess,
  showDecryptWalletModal,
  hideDecryptWalletModal,
  setCurrentWallet,
  transferError,
  transfer,
  deleteWallet,
  addNewWallet,
  lockWallet,
  transferSuccess,
  dragWallet,
  toggleFoldWallet,
} from '../actions';
import { DRAG_WALLET } from '../constants';

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
      },
      wallets: [],
      currentWallet: {
        address: '',
      },
      currentDecryptionCallback: null,
    });
    stateWithWallet = state.setIn(['wallets', 0], fromJS(wallet));
  });

  it('returns the initial state', () => {
    expect(walletHocReducer(undefined, {})).toEqual(state);
  });

  describe('dragWallet handling', () => {
    it('should drag a wallet correctly', () => {
      const oldIndex = 0;
      const newIndex = 1;
      const wallets = fromJS([{ name: '1' }, { name: '2' }]);
      const mockState = state.set('wallets', wallets);
      const expected = state.set('wallets', fromJS([{ name: '2' }, { name: '1' }]));
      expect(walletHocReducer(
        mockState,
        dragWallet({ wallets, oldIndex, newIndex })
      )).toEqual(expected);
    });

    it('should throw an error if any wallets are lost', () => {
      const mockState = state.set('wallets', fromJS([{ name: '1' }, { name: '2' }]));
      expect(() => walletHocReducer(
        mockState,
        { type: DRAG_WALLET, newWallets: [] }
      )).toThrowError('Invalid DRAG_WALLET action payload');
    });
  });

  describe('toggle collapsing for wallet cards', () => {
    const wallets = fromJS([{ name: '1', address: '0x1' }, { name: '2', address: '0x2' }]);
    it('should fold the wallet card', () => {
      const address = '0x2';
      const mockState = state.set('wallets', wallets);
      const expected = mockState.setIn(['wallets', findWalletIndex(mockState, address), 'folded'], true);
      expect(walletHocReducer(
        mockState,
        toggleFoldWallet(address)
      )).toEqual(expected);
    });

    it('should unfold the wallet card', () => {
      const address = '0x1';
      let mockState = state.set('wallets', wallets);
      mockState = mockState.setIn(['wallets', findWalletIndex(mockState, address), 'folded'], true);
      const expected = mockState.setIn(['wallets', findWalletIndex(mockState, address), 'folded'], false);
      expect(walletHocReducer(
        mockState,
        toggleFoldWallet(address)
      )).toEqual(expected);
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

    it('should handle lockWallet action correctly', () => {
      const address = '0x00';
      const testState = state
        .setIn(['wallets', 0], fromJS({ address, encrypted: { pubKey: '0321' }, decrypted: { pubKey: '0321', privKey: '0x123' } }));
      const expected = testState
        .deleteIn(['wallets', 0, 'decrypted']);
      expect(walletHocReducer(testState, lockWallet(address))).toEqual(expected);
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
    it('MAKE_NAHMII_PAYMENT', () => {
      const currentWallet = {
        address: '',
        transfering: true,
        transferError: null,
        lastTransaction: null,
      };
      const expected = state
        .set('currentWallet', fromJS(currentWallet));

      expect(walletHocReducer(state, makeNahmiiPayment())).toEqual(expected);
    });
    it('TRANSFER_SUCCESS', () => {
      const currentWallet = {
        address: '',
        transfering: false,
        transferError: null,
      };
      const expected = state
        .set('currentWallet', fromJS(currentWallet));

      expect(walletHocReducer(state, transferSuccess({}))).toEqual(expected);
    });
    it('MAKE_NAHMII_PAYMENT_SUCCESS', () => {
      const currentWallet = {
        address: '',
        transfering: false,
        transferError: null,
      };
      const expected = state
        .set('currentWallet', fromJS(currentWallet));

      expect(walletHocReducer(state, nahmiiPaymentSuccess())).toEqual(expected);
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
    it('MAKE_NAHMII_PAYMENT_ERROR', () => {
      const error = { message: 'error' };
      const currentWallet = {
        address: '',
        transfering: false,
        transferError: error.message,
        lastTransaction: null,
      };
      const expected = state
        .set('currentWallet', fromJS(currentWallet));

      expect(walletHocReducer(state, nahmiiPaymentError(error))).toEqual(expected);
    });
    it('SHOW_DECRYPT_WALLET_MODAL', () => {
      const currentWallet = {
        address: '',
        showDecryptModal: true,
      };
      const decryptionCallback = { type: 'TRANSFER' };
      const expected = state
        .set('currentWallet', fromJS(currentWallet))
        .set('currentDecryptionCallback', fromJS(decryptionCallback));

      expect(walletHocReducer(state, showDecryptWalletModal(decryptionCallback))).toEqual(expected);
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

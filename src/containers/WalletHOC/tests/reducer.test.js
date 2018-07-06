
import { fromJS } from 'immutable';
import walletHocReducer from '../reducer';
import {
  createWalletFromMnemonic,
  createWalletFailed,
  createWalletSuccess,
  decryptWallet,
  decryptWalletFailed,
  decryptWalletSuccess,
  loadWalletsSuccess,
  loadWalletBalances,
  loadWalletBalancesSuccess,
  loadWalletBalancesError,
  setCurrentWallet,
  transferError,
  transfer,
  showDecryptWalletModal,
  hideDecryptWalletModal,
  ledgerDetected,
} from '../actions';
import { LEDGER_ERROR, SAVE_LEDGER_ADDRESS, FETCHED_LEDGER_ADDRESS } from '../constants';

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
        ledgerError: 'Initialising, please try again in a few seconds...',
      },
      wallets: {
        software: {},
        hardware: {},
      },
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
    });
  });

  it('returns the initial state', () => {
    expect(walletHocReducer(undefined, {})).toEqual(state);
  });

  describe('software wallet lifecycle reducers', () => {
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
      const expected = state
      .setIn(['loading', 'creatingWallet'], false)
      .setIn(['inputs', 'password'], '')
      .setIn(['errors', 'creatingWalletError'], null)
      .setIn(['wallets', 'software', name],
        fromJS({ encrypted: encryptedWallet, decrypted: decryptedWallet }));
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
      const expected = state
        .setIn(['loading', 'decryptingWallet'], false)
        .setIn(['inputs', 'password'], '')
        .setIn(['errors', 'decryptingWalletError'], null)
        .setIn(['wallets', 'software', name, 'decrypted'], decryptedWallet);
      expect(walletHocReducer(state, decryptWalletSuccess(name, decryptedWallet))).toEqual(expected);
    });

    it('should handle decryptWalletFailed action correctly', () => {
      const error = 'error 1';
      const expected = state
        .setIn(['loading', 'decryptingWallet'], false)
        .setIn(['errors', 'decryptingWalletError'], error);
      expect(walletHocReducer(state, decryptWalletFailed(error))).toEqual(expected);
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
          .set('ledgerNanoSInfo', fromJS({ status: 'disconnected' }))
          .setIn(['errors', 'ledgerError'], error);
        expect(walletHocReducer(state, { type: LEDGER_ERROR, error })).toEqual(expected);
      });

      it('should handle SAVE_LEDGER_ADDRESS action correctly', () => {
        const name = 'ledger1';
        const newLedgerWallet = { ledger: '123' };
        const expected = state
          .setIn(['wallets', 'hardware', 'ledger', name], fromJS(newLedgerWallet));
        expect(walletHocReducer(state, { type: SAVE_LEDGER_ADDRESS, name, newLedgerWallet })).toEqual(expected);
      });

      it('should handle FETCHED_LEDGER_ADDRESS action correctly', () => {
        const derivationPath = 'm01201010';
        const address = '0x0000000000000';
        const expected = state
          .setIn(['ledgerNanoSInfo', 'addresses', derivationPath], address);
        expect(walletHocReducer(state, { type: FETCHED_LEDGER_ADDRESS, address, derivationPath })).toEqual(expected);
      });
    });

    describe('load wallet stores', () => {
      xit('load wallets', () => {
        const wallets = { software: { testWallet: { encrypted: '' } }, hardware: {} };
        const expected = state
          .set('wallets', fromJS(wallets));

        expect(walletHocReducer(state, loadWalletsSuccess(wallets))).toEqual(expected);
      });

      describe('balances', () => {
        it('load wallet balances', () => {
          const wallets = { software: { testWallet: {} }, hardware: {} };
          const loading = true;
          const walletName = 'testWallet';
          const expected = state
            .set('wallets', fromJS(wallets))
            .setIn(['wallets', 'software', walletName, 'loadingBalances'], loading);

          expect(walletHocReducer(state, loadWalletBalances(walletName, 'test'))).toEqual(expected);
        });

        it('load wallet balances', () => {
          const wallets = { software: { testWallet: {} }, hardware: {} };
          const balances = { tokenBalances: { tokens: [] } };
          const walletName = 'testWallet';
          const expected = state
            .set('wallets', fromJS(wallets))
            .setIn(['wallets', 'software', walletName, 'loadingBalances'], false)
            .setIn(['wallets', 'software', walletName, 'loadingBalancesError'], null)
            .setIn(['wallets', 'software', walletName, 'balances'], fromJS(balances.tokenBalances.tokens));

          expect(walletHocReducer(state, loadWalletBalancesSuccess(walletName, balances.tokenBalances))).toEqual(expected);
        });

        it('should default to empty array if token property is null', () => {
          const wallets = { software: { testWallet: {} }, hardware: {} };
          const balances = { tokenBalances: {} };
          const walletName = 'testWallet';
          const expected = state
            .set('wallets', fromJS(wallets))
            .setIn(['wallets', 'software', walletName, 'loadingBalances'], false)
            .setIn(['wallets', 'software', walletName, 'loadingBalancesError'], null)
            .setIn(['wallets', 'software', walletName, 'balances'], fromJS([]));

          expect(walletHocReducer(state, loadWalletBalancesSuccess(walletName, balances.tokenBalances))).toEqual(expected);
        });

        it('load wallet balances error', () => {
          const wallets = { software: { testWallet: {} }, hardware: {} };
          const error = new Error();
          const walletName = 'testWallet';
          const expected = state
            .set('wallets', fromJS(wallets))
            .setIn(['wallets', 'software', walletName, 'loadingBalances'], false)
            .setIn(['wallets', 'software', walletName, 'loadingBalancesError'], error);

          expect(walletHocReducer(state, loadWalletBalancesError(walletName, error))).toEqual(expected);
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
  });
});

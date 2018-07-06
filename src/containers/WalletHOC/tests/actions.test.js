import {
  createWalletFromMnemonic,
  createWalletFailed,
  createWalletSuccess,
  decryptWallet,
  decryptWalletFailed,
  decryptWalletSuccess,
  loadWallets,
  pollLedger,
  ledgerDetected,
  ledgerError,
} from '../actions';
import {
  CREATE_WALLET_FROM_MNEMONIC,
  CREATE_WALLET_FAILURE,
  CREATE_WALLET_SUCCESS,
  DECRYPT_WALLET,
  DECRYPT_WALLET_FAILURE,
  DECRYPT_WALLET_SUCCESS,
  LOAD_WALLETS,
  POLL_LEDGER,
  LEDGER_DETECTED,
  LEDGER_ERROR,
} from '../constants';

import getFriendlyError from '../../../utils/ledger/friendlyErrors';

describe('WalletHoc actions', () => {
  describe('createWalletFromMnemonic Action', () => {
    const name = 'Wallet8';
    const mnemonic = 'word word word';
    const derivationPath = '0/0/0';
    const password = 'password1';
    it('returns expected output', () => {
      const expected = {
        type: CREATE_WALLET_FROM_MNEMONIC,
        name,
        mnemonic,
        derivationPath,
        password,
      };
      expect(createWalletFromMnemonic(
        name,
        mnemonic,
        derivationPath,
        password
      )).toEqual(expected);
    });
  });

  describe('createWalletSuccess Action', () => {
    it('returns expected output', () => {
      const encryptedWallet = '{ blah: "blah123" }';
      const decryptedWallet = { key: 'twinkletoes' };
      const name = 'George';
      const expected = {
        type: CREATE_WALLET_SUCCESS,
        name,
        newWallet: {
          encrypted: encryptedWallet,
          decrypted: decryptedWallet,
        },
      };
      expect(createWalletSuccess(
        name,
        encryptedWallet,
        decryptedWallet)).toEqual(expected);
    });
  });

  describe('createWalletFailed Action', () => {
    it('returns expected output', () => {
      const error = 'Error 1';
      const expected = {
        type: CREATE_WALLET_FAILURE,
        error,
      };
      expect(createWalletFailed(error)).toEqual(expected);
    });
  });

  describe('decryptWallet Action', () => {
    it('returns expected output', () => {
      const expected = {
        type: DECRYPT_WALLET,
      };
      expect(decryptWallet()).toEqual(expected);
    });
  });

  describe('decryptWalletSuccess Action', () => {
    it('returns expected output', () => {
      const decryptedWallet = { privatekey: '1234' };
      const name = 'test';
      const expected = {
        type: DECRYPT_WALLET_SUCCESS,
        decryptedWallet,
        name,
      };
      expect(decryptWalletSuccess(name, decryptedWallet)).toEqual(expected);
    });
  });

  describe('decryptWalletFailed Action', () => {
    it('returns expected output', () => {
      const error = 'Error 1';
      const expected = {
        type: DECRYPT_WALLET_FAILURE,
        error,
      };
      expect(decryptWalletFailed(error)).toEqual(expected);
    });
  });

  describe('loadWallets Action', () => {
    it('returns expected output', () => {
      const expected = {
        type: LOAD_WALLETS,
      };
      expect(loadWallets()).toEqual(expected);
    });
  });

  describe('pollLedger Action', () => {
    it('returns expected output', () => {
      const expected = {
        type: POLL_LEDGER,
      };
      expect(pollLedger()).toEqual(expected);
    });
  });

  describe('ledgerDetected Action', () => {
    it('returns expected output', () => {
      const id = '048ncjdh39';
      const expected = {
        type: LEDGER_DETECTED,
        id,
      };
      expect(ledgerDetected(id)).toEqual(expected);
    });
  });

  describe('ledgerError Action', () => {
    it('converts error and returns expected output', () => {
      const error = { id: 'ListenTimeout' };
      const friendlyError = getFriendlyError(error);
      const expected = {
        type: LEDGER_ERROR,
        error: friendlyError,
      };
      expect(ledgerError(error)).toEqual(expected);
    });
  });
});

import {
  createNewWallet,
  createNewWalletFailed,
  createNewWalletSuccess,
  decryptWallet,
  decryptWalletFailed,
  decryptWalletSuccess,
  updateProgress,
} from '../actions';
import {
  CREATE_NEW_WALLET,
  CREATE_NEW_WALLET_FAILURE,
  CREATE_NEW_WALLET_SUCCESS,
  UPDATE_PROGRESS,
  DECRYPT_WALLET,
  DECRYPT_WALLET_FAILURE,
  DECRYPT_WALLET_SUCCESS,
} from '../constants';

describe('WalletManager actions', () => {
  describe('createNewWallet Action', () => {
    it('returns expected output', () => {
      const expected = {
        type: CREATE_NEW_WALLET,
      };
      expect(createNewWallet()).toEqual(expected);
    });
  });

  describe('createNewWalletSuccess Action', () => {
    it('returns expected output', () => {
      const encryptedWallet = { blah: 'blah123' };
      const expected = {
        type: CREATE_NEW_WALLET_SUCCESS,
        encryptedWallet,
      };
      expect(createNewWalletSuccess(encryptedWallet)).toEqual(expected);
    });
  });

  describe('createNewWalletFailed Action', () => {
    it('returns expected output', () => {
      const error = 'Error 1';
      const expected = {
        type: CREATE_NEW_WALLET_FAILURE,
        error,
      };
      expect(createNewWalletFailed(error)).toEqual(expected);
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
      const expected = {
        type: DECRYPT_WALLET_SUCCESS,
        decryptedWallet,
      };
      expect(decryptWalletSuccess(decryptedWallet)).toEqual(expected);
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

  describe('updateProgress Action', () => {
    it('returns expected output', () => {
      const percent = 11;
      const expected = {
        type: UPDATE_PROGRESS,
        percent,
      };
      expect(updateProgress(percent)).toEqual(expected);
    });
  });
});

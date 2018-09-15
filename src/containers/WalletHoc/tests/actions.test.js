import {
  createWalletFromMnemonic,
  createWalletFailed,
  createWalletSuccess,
  decryptWallet,
  decryptWalletFailed,
  decryptWalletSuccess,
  deleteWallet,
  showDecryptWalletModal,
} from '../actions';

import {
  CREATE_WALLET_FROM_MNEMONIC,
  CREATE_WALLET_FAILURE,
  CREATE_WALLET_SUCCESS,
  DECRYPT_WALLET,
  DECRYPT_WALLET_FAILURE,
  DECRYPT_WALLET_SUCCESS,
  DELETE_WALLET,
  SHOW_DECRYPT_WALLET_MODAL,
  TRANSFER,
} from '../constants';


describe('WalletHoc actions', () => {
  describe('deleteWallet Action', () => {
    const address = '0x00';
    it('returns expected output', () => {
      const expected = {
        type: DELETE_WALLET,
        address,
      };
      expect(deleteWallet(address)).toEqual(expected);
    });
  });

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
      const encryptedWallet = JSON.stringify({ address: '123' });
      const decryptedWallet = { address: '0x000' };
      const name = 'George';
      const expected = {
        type: CREATE_WALLET_SUCCESS,
        newWallet: {
          name,
          address: decryptedWallet.address,
          type: 'software',
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
      const encryptedWallet = { add: '12' };
      const password = 'pass';
      const address = '0x12';
      const expected = {
        type: DECRYPT_WALLET,
        encryptedWallet,
        address,
        password,
      };
      expect(decryptWallet(address, encryptedWallet, password)).toEqual(expected);
    });
  });

  describe('decryptWalletSuccess Action', () => {
    it('returns expected output', () => {
      const decryptedWallet = { privatekey: '1234' };
      const address = '0x00';
      const expected = {
        type: DECRYPT_WALLET_SUCCESS,
        address,
        decryptedWallet,
      };
      expect(decryptWalletSuccess(address, decryptedWallet)).toEqual(expected);
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

  describe('showDecryptWalletModal Action', () => {
    it('returns expected output with callback action', () => {
      const callbackAction = {
        type: TRANSFER,
      };
      const expected = {
        type: SHOW_DECRYPT_WALLET_MODAL,
        callbackAction,
      };
      expect(showDecryptWalletModal(callbackAction)).toEqual(expected);
    });
  });
});

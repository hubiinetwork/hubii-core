import {
  createWalletFromMnemonic,
  createWalletFailed,
  createWalletSuccess,
  decryptWallet,
  decryptWalletFailed,
  decryptWalletSuccess,
  loadWallets,
  ledgerEthAppConnected,
  ledgerError,
  deleteWallet,
  saveLedgerAddress,
  initLedger,
} from '../actions';
import {
  CREATE_WALLET_FROM_MNEMONIC,
  CREATE_WALLET_FAILURE,
  CREATE_WALLET_SUCCESS,
  DECRYPT_WALLET,
  DECRYPT_WALLET_FAILURE,
  DECRYPT_WALLET_SUCCESS,
  LOAD_WALLETS,
  LEDGER_ETH_CONNECTED,
  LEDGER_ERROR,
  DELETE_WALLET,
  INIT_LEDGER,
} from '../constants';

import getFriendlyError from '../../../utils/ledger/friendlyErrors';

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

  describe('loadWallets Action', () => {
    it('returns expected output', () => {
      const expected = {
        type: LOAD_WALLETS,
      };
      expect(loadWallets()).toEqual(expected);
    });
  });

  describe('initLedger Action', () => {
    it('returns expected output', () => {
      const expected = {
        type: INIT_LEDGER,
      };
      expect(initLedger()).toEqual(expected);
    });
  });

  describe('ledgerEthAppConnected Action', () => {
    it('returns expected output', () => {
      const id = '048ncjdh39';
      const descriptor = 'desc';
      const expected = {
        type: LEDGER_ETH_CONNECTED,
        id,
        descriptor,
      };
      expect(ledgerEthAppConnected(descriptor, id)).toEqual(expected);
    });
  });

  // should dispatch new add wallet action
  describe('saveLedgerAddress Action', () => {
    it('returns expected output', () => {
      const deviceId = '0x0028342093';
      const address = '0x000';
      const name = 'wallet12';
      const derivationPath = 'm/0/0123';
      const newWallet = {
        deviceId,
        address,
        type: 'lns',
        name,
        derivationPath,
      };
      const expected = {
        type: CREATE_WALLET_SUCCESS,
        newWallet,
      };
      expect(saveLedgerAddress(name, derivationPath, deviceId, address)).toEqual(expected);
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

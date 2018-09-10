import {
  createWalletFromMnemonic,
  createWalletFailed,
  createWalletSuccess,
  decryptWallet,
  decryptWalletFailed,
  decryptWalletSuccess,
  deleteWallet,
  showDecryptWalletModal,
  loadWalletBalances,
  loadWalletBalancesSuccess,
  loadWalletBalancesError,
  loadTransactions,
  loadTransactionsSuccess,
  loadTransactionsError,
  loadSupportedTokens,
  loadSupportedTokensSuccess,
  loadSupportedTokensError,
  loadPrices,
  loadPricesSuccess,
  loadPricesError,
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
  LOAD_WALLET_BALANCES,
  LOAD_WALLET_BALANCES_SUCCESS,
  LOAD_WALLET_BALANCES_ERROR,
  LOAD_TRANSACTIONS,
  LOAD_TRANSACTIONS_ERROR,
  LOAD_TRANSACTIONS_SUCCESS,
  LOAD_SUPPORTED_TOKENS,
  LOAD_SUPPORTED_TOKENS_SUCCESS,
  LOAD_SUPPORTED_TOKENS_ERROR,
  LOAD_PRICES,
  LOAD_PRICES_SUCCESS,
  LOAD_PRICES_ERROR,
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

  describe('loadWalletBalances Action', () => {
    it('returns expected output', () => {
      const address = '123';
      const expected = {
        type: LOAD_WALLET_BALANCES,
        address,
      };
      expect(loadWalletBalances(address)).toEqual(expected);
    });
  });

  describe('loadWalletBalancesSuccess Action', () => {
    it('returns expected output', () => {
      const address = '123';
      const assets = [1, 2, 5];
      const expected = {
        type: LOAD_WALLET_BALANCES_SUCCESS,
        address,
        assets,
      };
      expect(loadWalletBalancesSuccess(address, assets)).toEqual(expected);
    });
  });

  describe('loadWalletBalancesError Action', () => {
    it('returns expected output', () => {
      const address = '123';
      const error = 'error';
      const expected = {
        type: LOAD_WALLET_BALANCES_ERROR,
        address,
        error,
      };
      expect(loadWalletBalancesError(address, error)).toEqual(expected);
    });
  });

  describe('loadTransactions Action', () => {
    it('returns expected output', () => {
      const address = '123';
      const expected = {
        type: LOAD_TRANSACTIONS,
        address,
      };
      expect(loadTransactions(address)).toEqual(expected);
    });
  });

  describe('loadTransactionsSuccess Action', () => {
    it('returns expected output', () => {
      const address = '123';
      const transactions = [1, 2, 5];
      const expected = {
        type: LOAD_TRANSACTIONS_SUCCESS,
        address,
        transactions,
      };
      expect(loadTransactionsSuccess(address, transactions)).toEqual(expected);
    });
  });

  describe('loadTransactionsError Action', () => {
    it('returns expected output', () => {
      const address = '123';
      const error = 'error';
      const expected = {
        type: LOAD_TRANSACTIONS_ERROR,
        address,
        error,
      };
      expect(loadTransactionsError(address, error)).toEqual(expected);
    });
  });

  describe('loadSupportedTokens Action', () => {
    it('returns expected output', () => {
      const expected = {
        type: LOAD_SUPPORTED_TOKENS,
      };
      expect(loadSupportedTokens()).toEqual(expected);
    });
  });

  describe('loadSupportedTokensSuccess Action', () => {
    it('returns expected output', () => {
      const tokens = [1, 2, 5];
      const expected = {
        type: LOAD_SUPPORTED_TOKENS_SUCCESS,
        assets: [...tokens, { currency: 'ETH', symbol: 'ETH', decimals: 18, color: '5C78E4' }],
      };
      expect(loadSupportedTokensSuccess(tokens)).toEqual(expected);
    });
  });

  describe('loadSupportedTokensError Action', () => {
    it('returns expected output', () => {
      const error = 'error';
      const expected = {
        type: LOAD_SUPPORTED_TOKENS_ERROR,
        error,
      };
      expect(loadSupportedTokensError(error)).toEqual(expected);
    });
  });

  describe('loadPrices Action', () => {
    it('returns expected output', () => {
      const expected = {
        type: LOAD_PRICES,
      };
      expect(loadPrices()).toEqual(expected);
    });
  });

  describe('loadPricesSuccess Action', () => {
    it('returns expected output', () => {
      const prices = [1, 2, 5];
      const expected = {
        type: LOAD_PRICES_SUCCESS,
        prices: [...prices, { currency: 'ETH', eth: 1, btc: 0.01, usd: 412 }],
      };
      expect(loadPricesSuccess(prices)).toEqual(expected);
    });
  });

  describe('loadPricesError Action', () => {
    it('returns expected output', () => {
      const error = 'error';
      const expected = {
        type: LOAD_PRICES_ERROR,
        error,
      };
      expect(loadPricesError(error)).toEqual(expected);
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

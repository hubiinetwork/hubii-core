import {
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

import {
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

describe('HubiiApiHoc actions', () => {
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
        assets: [...tokens],
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
        prices,
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
});

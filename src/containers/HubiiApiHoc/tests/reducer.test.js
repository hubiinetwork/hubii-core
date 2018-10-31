import { fromJS } from 'immutable';

import { changeNetwork } from 'containers/App/actions';

import {
  supportedAssetsLoadedMock,
  pricesLoadedMock,
} from 'containers/HubiiApiHoc/tests/mocks/selectors';

import {
  supportedTokensMock,
} from 'containers/HubiiApiHoc/tests/mocks';

import {
  loadWalletBalancesSuccess,
  loadWalletBalancesError,
  loadTransactionsError,
  loadTransactionsSuccess,
  loadSupportedTokens,
  loadSupportedTokensSuccess,
  loadSupportedTokensError,
  loadPricesSuccess,
  loadPricesError,
} from '../actions';


import hubiiApiHocReducer from '../reducer';

describe('hubiiApiHocReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      transactions: {},
      balances: {},
      prices: {
        loading: true,
        error: null,
        assets: [],
      },
      supportedAssets: {
        loading: true,
        error: null,
        assets: [],
      },
    });
  });

  it('returns the initial state', () => {
    expect(hubiiApiHocReducer(undefined, {})).toEqual(state);
  });

  describe('balances', () => {
    it('load wallet balances success', () => {
      const address = '0x00';
      const balances = [];
      const expected = state
        .setIn(['balances', address, 'loading'], false)
        .setIn(['balances', address, 'error'], null)
        .setIn(['balances', address, 'assets'], fromJS(balances));

      expect(hubiiApiHocReducer(state, loadWalletBalancesSuccess(address, balances))).toEqual(expected);
    });
    it('should default to empty array if token property is null', () => {
      const address = '0x00';
      const balances = null;
      const expected = state
        .setIn(['balances', address, 'loading'], false)
        .setIn(['balances', address, 'error'], null)
        .setIn(['balances', address, 'assets'], fromJS([]));

      expect(hubiiApiHocReducer(state, loadWalletBalancesSuccess(address, balances))).toEqual(expected);
    });
    it('load wallet balances error', () => {
      const address = '0x00';
      const error = new Error();
      const expected = state
        .setIn(['balances', address, 'loading'], false)
        .setIn(['balances', address, 'error'], error);

      expect(hubiiApiHocReducer(state, loadWalletBalancesError(address, error))).toEqual(expected);
    });
  });

  describe('transactions', () => {
    it('load transactions success', () => {
      const address = '0x00';
      const transactions = ['12', '21'];
      const expected = state
        .setIn(['transactions', address, 'loading'], false)
        .setIn(['transactions', address, 'error'], null)
        .setIn(['transactions', address, 'transactions'], fromJS(transactions));

      expect(hubiiApiHocReducer(state, loadTransactionsSuccess(address, transactions))).toEqual(expected);
    });

    it('should default to empty array if token property is null', () => {
      const address = '0x00';
      const transactions = null;
      const expected = state
        .setIn(['transactions', address, 'loading'], false)
        .setIn(['transactions', address, 'error'], null)
        .setIn(['transactions', address, 'transactions'], fromJS([]));

      expect(hubiiApiHocReducer(state, loadTransactionsSuccess(address, transactions))).toEqual(expected);
    });

    it('should correctly handle error', () => {
      const address = '0x00';
      const error = new Error();
      const expected = state
        .setIn(['transactions', address, 'loading'], false)
        .setIn(['transactions', address, 'error'], error)
        .setIn(['transactions', address, 'transactions'], fromJS([]));

      expect(hubiiApiHocReducer(state, loadTransactionsError(address, error))).toEqual(expected);
    });
  });

  describe('supported tokens', () => {
    it('handle LOAD_SUPPORTED_TOKENS correctly', () => {
      const expected = state
        .setIn(['supportedAssets', 'loading'], true);

      expect(hubiiApiHocReducer(state, loadSupportedTokens())).toEqual(expected);
    });

    it('handle LOAD_SUPPORTED_TOKENS_SUCCESS correctly', () => {
      const expected = state
        .setIn(['supportedAssets', 'loading'], false)
        .setIn(['supportedAssets', 'error'], null)
        .setIn(['supportedAssets', 'assets'], fromJS(supportedAssetsLoadedMock.get('assets')));

      expect(hubiiApiHocReducer(state, loadSupportedTokensSuccess(supportedTokensMock))).toEqual(expected);
    });

    it('handle LOAD_SUPPORTED_TOKENS_ERROR correctly', () => {
      const error = 'error';
      const expected = state
        .setIn(['supportedAssets', 'loading'], false)
        .setIn(['supportedAssets', 'error'], error);

      expect(hubiiApiHocReducer(state, loadSupportedTokensError(error))).toEqual(expected);
    });
  });

  describe('prices', () => {
    it('handle LOAD_PRICES_SUCCESS correctly', () => {
      const prices = pricesLoadedMock.get('assets');
      const expected = state
        .setIn(['prices', 'loading'], false)
        .setIn(['prices', 'error'], null)
        .setIn(['prices', 'assets'], fromJS(pricesLoadedMock.get('assets')));

      expect(hubiiApiHocReducer(state, loadPricesSuccess(prices))).toEqual(expected);
    });

    it('handle LOAD_PRICES_ERROR correctly', () => {
      const error = 'error';
      const expected = state
        .setIn(['prices', 'loading'], true)
        .setIn(['prices', 'error'], error);

      expect(hubiiApiHocReducer(state, loadPricesError(error))).toEqual(expected);
    });
  });

  describe('a network change', () => {
    it('should reset values to loading/empty', () => {
      const testState = state
        .setIn(['supportedAssets', 'loading'], false)
        .setIn(['prices', 'loading'], false)
        .set('transactions', fromJS({ '0x00': {} }))
        .set('balances', fromJS({ '0x00': {} }));
      const expected = state
        .setIn(['supportedAssets', 'loading'], true)
        .setIn(['prices', 'loading'], true)
        .set('transactions', fromJS({}))
        .set('balances', fromJS({}));

      expect(hubiiApiHocReducer(testState, changeNetwork('some network'))).toEqual(expected);
    });
  });
});

import { fromJS } from 'immutable';
import { expectSaga, testSaga } from 'redux-saga-test-plan';
import { requestWalletAPI } from 'utils/request';
import { fork, takeEvery } from 'redux-saga/effects';
import { createMockTask } from 'redux-saga/utils';

import { CHANGE_NETWORK } from 'containers/App/constants';

import {
  walletsMock,
} from 'containers/WalletHOC/tests/mocks/selectors';

import {
  currentNetworkMock,
} from 'containers/App/tests/mocks/selectors';

import {
  supportedTokensMock,
} from './mocks';

import {
  balancesMock,
  supportedAssetsLoadedMock,
} from './mocks/selectors';

import {
  INIT_HUBII_API,
} from '../constants';

import hubiiApiHoc, {
  loadTransactions,
  networkApiOrcestrator,
  loadWalletBalances,
  loadSupportedTokens,
  loadPrices as loadPricesSaga,
} from '../saga';

import {
  loadTransactionsSuccess,
  loadTransactionsError,
  loadWalletBalancesSuccess,
  loadWalletBalancesError,
  loadSupportedTokensSuccess,
  loadSupportedTokensError,
  loadPricesSuccess,
  loadPricesError,
} from '../actions';


import hubiiApiHocReducer, { initialState } from '../reducer';

const withReducer = (state, action) => state.set('hubiiApiHoc', hubiiApiHocReducer(state.get('hubiiApiHoc'), action));

describe('hubiiApi saga', () => {
  describe('network api orcentrator', () => {
    const wallets = walletsMock;
    const mockTask = createMockTask();
    it('should fork all required sagas, cancelling and restarting on CHANGE_NETWORK', () => {
      const saga = testSaga(networkApiOrcestrator);
      const allSagas = [
        ...wallets.map((wallet) => fork(loadWalletBalances, { address: wallet.get('address') }, currentNetworkMock.walletApiEndpoint)),
        ...wallets.map((wallet) => fork(loadTransactions, { address: wallet.get('address') }, currentNetworkMock.walletApiEndpoint)),
        fork(loadSupportedTokens, currentNetworkMock.walletApiEndpoint),
        fork(loadPricesSaga, currentNetworkMock.walletApiEndpoint),
      ];
      saga
        .next() // network selector
        .next(currentNetworkMock) // wallets selector
        .next(wallets).all(allSagas)
        .next([mockTask]).take(CHANGE_NETWORK)
        .next().cancel(mockTask)
        .next() // notify
        .next() // network selector
        .next(currentNetworkMock) // wallets selector
        .next(wallets).all(allSagas);
    });
  });


  describe('supported tokens', () => {
    const requestPath = 'ethereum/supported-tokens';
    it('should load supported tokens', () => {
      const tokens = supportedTokensMock;
      const assets = supportedAssetsLoadedMock;

      return expectSaga(loadSupportedTokens)
        .withReducer(withReducer, initialState)
        .provide({
          call(effect) {
            expect(effect.fn).toBe(requestWalletAPI);
            expect(effect.args[0], requestPath);
            return tokens;
          },
        })
        .put(loadSupportedTokensSuccess(tokens))
        .run({ silenceTimeout: true })
        .then((result) => {
          const supportedAssets = result.storeState.getIn(['hubiiApiHoc', 'supportedAssets']);
          expect(supportedAssets.get('loading')).toEqual(false);
          expect(supportedAssets.get('error')).toEqual(null);
          expect(supportedAssets).toEqual(fromJS(assets));
        });
    });
    it('should handle request error', () => {
      const error = new Error();
      return expectSaga(loadSupportedTokens)
        .withReducer(withReducer, initialState)
        .provide({
          call(effect) {
            expect(effect.fn).toBe(requestWalletAPI);
            expect(effect.args[0], requestPath);
            throw error;
          },
        })
        .put(loadSupportedTokensError(error))
        .run({ silenceTimeout: true });
    });
    it('should correctly drop exising call and stop when cancelled', () => {
      const saga = testSaga(loadSupportedTokens, currentNetworkMock.walletApiEndpoint);
      saga
        .next().call(requestWalletAPI, requestPath, currentNetworkMock.walletApiEndpoint)
        .next().finish()
        .next().isDone();
    });
  });
  describe('prices', () => {
    it('should load prices when not exist in the store', () => {
      const response = [
        {
          currency: '0x8899544F1fc4E0D570f3c998cC7e5857140dC322',
          eth: 1,
          btc: 1,
          usd: 1,
        },
        {
          currency: '0x8899544F1fc4E0D570f3c998cC7e5857140dC323',
          eth: 1,
          btc: 1,
          usd: 1,
        },
      ];
      return expectSaga(loadPricesSaga)
        .withReducer(withReducer, initialState)
        .provide({
          call(effect) {
            expect(effect.fn).toBe(requestWalletAPI);
            expect(effect.args[0], 'ethereum/prices');
            return response;
          },
        })
        .put(loadPricesSuccess(response))
        .run({ silenceTimeout: true });
    });
    it('should handle request error', () => {
      const error = new Error();
      return expectSaga(loadPricesSaga)
        .withReducer(withReducer, initialState)
        .provide({
          call(effect) {
            expect(effect.fn).toBe(requestWalletAPI);
            expect(effect.args[0], 'ethereum/prices');
            throw error;
          },
        })
        .put(loadPricesError(error))
        .run({ silenceTimeout: true });
    });
  });

  describe('load transactions', () => {
    const address = '0x00';
    const requestPath = `ethereum/wallets/${address}/transactions`;
    let saga;
    beforeEach(() => {
      saga = testSaga(loadTransactions, { address }, currentNetworkMock.walletApiEndpoint);
    });
    it('should correctly handle success scenario', () => {
      const response = ['1', '2'];
      saga
        .next().call(requestWalletAPI, requestPath, currentNetworkMock.walletApiEndpoint)
        .next(response).put(loadTransactionsSuccess('0x00', response))
        .next() // delay
        .next().call(requestWalletAPI, requestPath, currentNetworkMock.walletApiEndpoint);
    });

    it('should correctly handle failed API call', () => {
      const e = new Error('error');
      saga
        .next().call(requestWalletAPI, requestPath, currentNetworkMock.walletApiEndpoint)
        .throw(e).put(loadTransactionsError(address, e))
        .next() // delay
        .next().call(requestWalletAPI, requestPath, currentNetworkMock.walletApiEndpoint);
    });

    it('should correctly drop exising call and stop when cancelled', () => {
      saga
        .next().call(requestWalletAPI, requestPath, currentNetworkMock.walletApiEndpoint)
        .next().finish()
        .next().isDone();
    });
  });

  describe('load balances', () => {
    const address = '0x00';
    const requestPath = `ethereum/wallets/${address}/balances`;
    let saga;
    beforeEach(() => {
      saga = testSaga(loadWalletBalances, { address }, currentNetworkMock.walletApiEndpoint);
    });
    it('should correctly handle success scenario', () => {
      const response = balancesMock.get(0);
      saga
        .next().call(requestWalletAPI, requestPath, currentNetworkMock.walletApiEndpoint)
        .next(response).put(loadWalletBalancesSuccess('0x00', response))
        .next() // delay
        .next().call(requestWalletAPI, requestPath, currentNetworkMock.walletApiEndpoint);
    });

    it('should correctly not poll when noPoll true', () => {
      saga = testSaga(loadWalletBalances, { address, noPoll: true }, currentNetworkMock.walletApiEndpoint);
      const response = balancesMock.get(0);
      saga
        .next().call(requestWalletAPI, requestPath, currentNetworkMock.walletApiEndpoint)
        .next(response).put(loadWalletBalancesSuccess('0x00', response))
        .next() // delay
        .next().isDone();
    });

    it('should correctly handle failed API call', () => {
      const e = new Error('error');
      saga
        .next().call(requestWalletAPI, requestPath, currentNetworkMock.walletApiEndpoint)
        .throw(e).put(loadWalletBalancesError(address, e))
        .next() // delay
        .next().call(requestWalletAPI, requestPath, currentNetworkMock.walletApiEndpoint);
    });

    it('should correctly drop exising call and stop when cancelled', () => {
      saga
        .next().call(requestWalletAPI, requestPath, currentNetworkMock.walletApiEndpoint)
        .next().finish()
        .next().isDone();
    });
  });

  describe('root Saga', () => {
    const hubiiApiHocSaga = hubiiApiHoc();
    it('should start task to watch for INIT_API_CALLS action', () => {
      const takeDescriptor = hubiiApiHocSaga.next().value;
      expect(takeDescriptor).toEqual(takeEvery(INIT_HUBII_API, networkApiOrcestrator));
    });
  });
});

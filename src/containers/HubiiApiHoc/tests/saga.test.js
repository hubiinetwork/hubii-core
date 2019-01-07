import { fromJS } from 'immutable';
import { expectSaga, testSaga } from 'redux-saga-test-plan';
import { delay } from 'redux-saga';
import { requestWalletAPI } from 'utils/request';
import { call, fork, takeEvery, take } from 'redux-saga/effects';
import { createMockTask } from 'redux-saga/utils';

import { CHANGE_NETWORK, INIT_NETWORK_ACTIVITY } from 'containers/App/constants';
import { ADD_NEW_WALLET } from 'containers/WalletHoc/constants';

import {
  walletsMock,
} from 'containers/WalletHoc/tests/mocks/selectors';

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

import hubiiApiHoc, {
  loadTransactions,
  networkApiOrcestrator,
  loadWalletBalances,
  loadSupportedTokens,
  loadPrices as loadPricesSaga,
  requestToken,
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
  loadIdentityServiceTokenSuccess,
} from '../actions';

import hubiiApiHocReducer, { initialState } from '../reducer';

const withReducer = (state, action) => state.set('hubiiApiHoc', hubiiApiHocReducer(state.get('hubiiApiHoc'), action));

describe('hubiiApi saga', () => {
  describe('network api orcentrator', () => {
    const ONE_MINUTE_IN_MS = 60 * 1000;
    const wallets = walletsMock;
    const mockTask = createMockTask();
    it('should fork all required sagas, cancelling and restarting on CHANGE_NETWORK', () => {
      const saga = testSaga(networkApiOrcestrator);
      const allSagas = [
        ...wallets.map((wallet) => fork(loadWalletBalances, { address: wallet.get('address') }, currentNetworkMock)),
        ...wallets.map((wallet) => fork(loadTransactions, { address: wallet.get('address') }, currentNetworkMock)),
        fork(loadSupportedTokens, currentNetworkMock),
        fork(loadPricesSaga, currentNetworkMock),
      ];
      saga
        .next() // request token
        .next() // network selector
        .next(currentNetworkMock) // wallets selector
        .next(wallets).all(allSagas)
        .next([mockTask]).race({
          timer: call(delay, ONE_MINUTE_IN_MS),
          override: take([CHANGE_NETWORK, ADD_NEW_WALLET]),
        })
        .next().cancel(mockTask)
        .next() // request token
        .next() // network selector
        .next(currentNetworkMock) // wallets selector
        .next(wallets).all(allSagas);
    });
  });

  describe('requestToken', () => {
    it('should fetch a token', () => {
      const token = 'token';

      return expectSaga(requestToken)
        .provide({
          select() {
            return currentNetworkMock;
          },
          call() {
            return token;
          },
        })
        .put(loadIdentityServiceTokenSuccess(token))
        .run({ silenceTimeout: true });
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
  xdescribe('prices', () => {
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

  xdescribe('load balances', () => {
    const address = '0x00';
    const requestPath = `ethereum/wallets/${address}/balances`;
    let saga;
    beforeEach(() => {
      saga = testSaga(loadWalletBalances, { address }, currentNetworkMock.walletApiEndpoint);
    });

    it('should select currentNetwork inside the saga network if noPoll is true', () => {
      saga = testSaga(loadWalletBalances, { address, noPoll: true });
      const network = { name: 'homestead' };
      saga
        .next() // network select
        .next(network).call(requestWalletAPI, requestPath, network);
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
      saga = testSaga(loadWalletBalances, { address, noPoll: true });
      const response = balancesMock.get(0);
      const network = { name: 'homestead' };
      saga
        .next() // select network
        .next(network).call(requestWalletAPI, requestPath, network)
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
      expect(takeDescriptor).toEqual(takeEvery(INIT_NETWORK_ACTIVITY, networkApiOrcestrator));
    });
  });
});

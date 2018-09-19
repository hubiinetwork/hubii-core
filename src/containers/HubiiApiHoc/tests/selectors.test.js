
import { storeMock } from 'mocks/store';

import { blockHeightLoadingMock, blockHeightErrorMock } from 'containers/EthOperationsHoc/tests/mocks/selectors';

import {
  transactionsMock,
  transactionsWithInfoMock,
  balancesMock,
  supportedAssetsLoadedMock,
  supportedAssetsLoadingMock,
  supportedAssetsErrorMock,
  pricesLoadedMock,
  pricesLoadingMock,
  pricesErrorMock,
} from './mocks/selectors';

import {
  makeSelectSupportedAssets,
  makeSelectPrices,
  makeSelectBalances,
  makeSelectTransactions,
  makeSelectTransactionsWithInfo,
} from '../selectors';

describe('makeSelectSupportedAssets', () => {
  const supportedAssetsSelector = makeSelectSupportedAssets();
  it('should correctly select supportedAssets state', () => {
    const expected = supportedAssetsLoadedMock;
    expect(supportedAssetsSelector(storeMock)).toEqual(expected);
  });
});

describe('makeSelectPrices', () => {
  const pricesSelector = makeSelectPrices();
  it('should correctly select prices state', () => {
    const expected = pricesLoadedMock;
    expect(pricesSelector(storeMock)).toEqual(expected);
  });
});

describe('makeSelectBalances', () => {
  const balancesSelector = makeSelectBalances();
  it('should correctly select balances state', () => {
    expect(balancesSelector(storeMock)).toEqual(balancesMock);
  });
});

describe('makeSelectTransactions', () => {
  const transactionsSelector = makeSelectTransactions();
  it('should correctly select transactions state', () => {
    expect(transactionsSelector(storeMock)).toEqual(transactionsMock);
  });
});

describe('makeSelectTransactionsWithInfo', () => {
  const transactionsWithInfoSelector = makeSelectTransactionsWithInfo();
  it('should add type, counterpartyAddress, symbol, decimal amt, fait value to all transactions', () => {
    const expected = transactionsWithInfoMock;
    expect(transactionsWithInfoSelector(storeMock)).toEqual(expected);
  });

  it('should mark add tx as loading when supportedAssets loading', () => {
    const mockedState = storeMock
      .setIn(['hubiiApiHoc', 'supportedAssets'], supportedAssetsLoadingMock);
    const expected = transactionsMock.map((a) => a.set('loading', true));
    expect(transactionsWithInfoSelector(mockedState)).toEqual(expected);
  });

  it('should mark add tx as loading when supportedAssets errored', () => {
    const mockedState = storeMock
      .setIn(['hubiiApiHoc', 'supportedAssets'], supportedAssetsErrorMock);
    const expected = transactionsMock.map((a) => a.set('loading', true));
    expect(transactionsWithInfoSelector(mockedState)).toEqual(expected);
  });

  it('should mark add tx as loading when prices loading', () => {
    const mockedState = storeMock
      .setIn(['hubiiApiHoc', 'prices'], pricesLoadingMock);
    const expected = transactionsMock.map((a) => a.set('loading', true));
    expect(transactionsWithInfoSelector(mockedState)).toEqual(expected);
  });

  it('should mark add tx as loading when prices errored', () => {
    const mockedState = storeMock
      .setIn(['hubiiApiHoc', 'prices'], pricesErrorMock);
    const expected = transactionsMock.map((a) => a.set('loading', true));
    expect(transactionsWithInfoSelector(mockedState)).toEqual(expected);
  });

  it('should mark add tx as loading when blockHeight loading', () => {
    const mockedState = storeMock
      .setIn(['ethOperationsHoc', 'blockHeight'], blockHeightLoadingMock);
    const expected = transactionsMock.map((a) => a.set('loading', true));
    expect(transactionsWithInfoSelector(mockedState)).toEqual(expected);
  });

  it('should mark add tx as loading when blockHeight errored', () => {
    const mockedState = storeMock
      .setIn(['ethOperationsHoc', 'blockHeight'], blockHeightErrorMock);
    const expected = transactionsMock.map((a) => a.set('loading', true));
    expect(transactionsWithInfoSelector(mockedState)).toEqual(expected);
  });
});

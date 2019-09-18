import { fromJS } from 'immutable';
import { storeMock } from 'mocks/store';

import {
  transactionsMock,
  transactionsWithInfoMock,
  balancesMock,
  supportedAssetsLoadedMock,
  supportedAssetsNullMock,
  pricesLoadedMock,
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
  let transactionsSelector;
  const address = '0x1c7429f62595097315289ceBaC1fDbdA587Ad512';

  beforeEach(() => {
    transactionsSelector = makeSelectTransactions();
  });

  it('should correctly select transactions state', () => {
    expect(transactionsSelector(storeMock)).toEqual(transactionsMock);
  });

  describe('when previous transactions state is null', () => {
    beforeEach(() => {
      expect(
        transactionsSelector(storeMock.setIn(['hubiiApiHoc', 'transactions', address, 'transactions'], null))
      ).toEqual(transactionsMock.setIn([address, 'transactions'], null));
    });
    it('should update the cache when the current transactions state has initialised array value', () => {
      expect(
        transactionsSelector(storeMock.setIn(['hubiiApiHoc', 'transactions', address, 'transactions'], []))
      ).toEqual(transactionsMock.setIn([address, 'transactions'], []));
    });
  });

  describe('when previous transactions state has initialised', () => {
    const store = storeMock.setIn(['hubiiApiHoc', 'transactions', address, 'transactions'], fromJS([{}]));
    const txs = transactionsMock.setIn([address, 'transactions'], fromJS([{}]));
    beforeEach(() => {
      expect(
        transactionsSelector(store)
      ).toEqual(txs);
    });
    describe('should update the cache', () => {
      it('when the size of transactions array is different from previous state', () => {
        expect(transactionsSelector(
          store.updateIn(['hubiiApiHoc', 'transactions', address, 'transactions'], (arr) => arr.push({}))
        )).toEqual(txs.updateIn([address, 'transactions'], (arr) => arr.push({})));
      });
    });
    describe('should not update the cache', () => {
      it('even when the loading state is changed', () => {
        expect(txs.getIn([address, 'loading'])).toEqual(false);
        expect(transactionsSelector(
          store.setIn(['hubiiApiHoc', 'transactions', address, 'loading'], true)
        )).toEqual(txs);
      });
      it('even when the size of the transaction array is different from the previous state', () => {
        expect(txs.getIn([address, 'newField'])).toEqual(undefined);
        expect(transactionsSelector(
          store.setIn(['hubiiApiHoc', 'transactions', address, 'transactions', 0, 'newField'], 'test')
        )).toEqual(txs);
      });
    });
  });
});

describe('makeSelectTransactionsWithInfo', () => {
  const transactionsWithInfoSelector = makeSelectTransactionsWithInfo();
  it('should add type, counterpartyAddress, symbol, decimal amt, fait value to all transactions', () => {
    const expected = transactionsWithInfoMock;
    expect(transactionsWithInfoSelector(storeMock)).toEqual(expected);
  });

  it('should mark add tx as loading when supportedAssets has null assets property', () => {
    const mockedState = storeMock
      .setIn(['hubiiApiHoc', 'supportedAssets'], supportedAssetsNullMock);
    const expected = transactionsMock.map((a) => a.set('loading', true).set('transactions', fromJS([])));
    expect(transactionsWithInfoSelector(mockedState)).toEqual(expected);
  });
});

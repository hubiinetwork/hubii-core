import { fromJS } from 'immutable';

import { storeMock } from 'mocks/store';

import {
  makeSelectNahmiiBalances,
  makeSelectReceipts,
  makeSelectReceiptsWithInfo,
} from '../selectors';

import {
  balances,
  balancesEmpty,
  receiptsLoaded,
  receiptsWithInfo,
} from './mocks/selectors';

describe('makeSelectNahmiiBalances', () => {
  const nahmiiBalancesSelector = makeSelectNahmiiBalances();
  it('should combine different types of balances from the store into a total', () => {
    const expected = balances;
    expect(nahmiiBalancesSelector(storeMock)).toEqual(expected);
  });

  it('should return loading total if available assets are loading', () => {
    const mockedState = storeMock.setIn(['nahmiiHoc', 'balances', 0, 'available', 'loading'], true);
    expect(nahmiiBalancesSelector(mockedState).getIn([0, 'total', 'loading'])).toEqual(true);
  });

  it('should return loading total if staged assets are loading', () => {
    const mockedState = storeMock.setIn(['nahmiiHoc', 'balances', 0, 'staged', 'loading'], true);
    expect(nahmiiBalancesSelector(mockedState).getIn([0, 'total', 'loading'])).toEqual(true);
  });

  it('should return loading total if staging assets are loading', () => {
    const mockedState = storeMock.setIn(['nahmiiHoc', 'balances', 0, 'staging', 'loading'], true);
    expect(nahmiiBalancesSelector(mockedState).getIn([0, 'total', 'loading'])).toEqual(true);
  });

  it('should return errored total if available assets are errored', () => {
    const mockedState = storeMock.setIn(['nahmiiHoc', 'balances', 0, 'staging', 'error'], 'someerror');
    expect(nahmiiBalancesSelector(mockedState).getIn([0, 'total', 'error'])).toEqual('someerror');
  });

  it('should return errored total if staged assets are errored', () => {
    const mockedState = storeMock.setIn(['nahmiiHoc', 'balances', 0, 'staged', 'error'], 'someerror');
    expect(nahmiiBalancesSelector(mockedState).getIn([0, 'total', 'error'])).toEqual('someerror');
  });

  it('should return errored total if staging assets are errored', () => {
    const mockedState = storeMock.setIn(['nahmiiHoc', 'balances', 0, 'staging', 'error'], 'someerror');
    expect(nahmiiBalancesSelector(mockedState).getIn([0, 'total', 'error'])).toEqual('someerror');
  });

  it('should return an empty object if no balances', () => {
    const mockedState = storeMock.setIn(['nahmiiHoc', 'balances'], fromJS({}));
    expect(nahmiiBalancesSelector(mockedState)).toEqual(balancesEmpty);
  });

  it('should return an empty object if balances undefined', () => {
    const mockedState = storeMock.deleteIn(['nahmiiHoc', 'balances']);
    expect(nahmiiBalancesSelector(mockedState)).toEqual(balancesEmpty);
  });
});

describe('makeSelectReceipts', () => {
  let receiptsSelector;
  const address = '0xF4db7c6030c9c5754A6A712212d6342DCA52e25d';
  beforeEach(() => {
    receiptsSelector = makeSelectReceipts();
  });
  it('should select receipts from the store state', () => {
    const expected = receiptsLoaded;
    expect(receiptsSelector(storeMock)).toEqual(expected);
  });

  describe('when previous receipts state is null', () => {
    beforeEach(() => {
      expect(
        receiptsSelector(storeMock.setIn(['nahmiiHoc', 'receipts', address, 'receipts'], null))
      ).toEqual(receiptsLoaded.setIn([address, 'receipts'], null));
    });
  });

  describe('when previous receipts state has initialised', () => {
    const store = storeMock.setIn(['nahmiiHoc', 'receipts', address, 'receipts'], fromJS([{ created: '2018' }]));
    const txs = receiptsLoaded.setIn([address, 'receipts'], fromJS([{ created: '2018' }]));
    beforeEach(() => {
      expect(
        receiptsSelector(store)
      ).toEqual(txs);
    });
    describe('should update the cache', () => {
      it('when the size of receipts array is different from previous state', () => {
        expect(receiptsSelector(
          store.updateIn(['nahmiiHoc', 'receipts', address, 'receipts'], (arr) => arr.push(fromJS({ created: '2019' })))
        )).toEqual(txs.updateIn([address, 'receipts'], (arr) => arr.push(fromJS({ created: '2019' }))));
      });
    });
    describe('should not update the cache', () => {
      it('when the last created property is the same', () => {
        expect(receiptsSelector(
          store.updateIn(['nahmiiHoc', 'receipts', address, 'receipts'], (arr) => arr.push(fromJS({ created: '2018' })))
        )).toEqual(txs);
      });
      it('even when the loading state is changed', () => {
        expect(txs.getIn([address, 'loading'])).toEqual(false);
        expect(receiptsSelector(
          store.setIn(['nahmiiHoc', 'receipts', address, 'loading'], true)
        )).toEqual(txs);
      });
      it('even when the size of the transaction array is different from the previous state', () => {
        expect(txs.getIn([address, 'newField'])).toEqual(undefined);
        expect(receiptsSelector(
          store.setIn(['nahmiiHoc', 'receipts', address, 'receipts', 0, 'newField'], 'test')
        )).toEqual(txs);
      });
    });
  });
});

describe('makeSelectReceiptsWithInfo', () => {
  const receiptsWithInfoSelector = makeSelectReceiptsWithInfo();
  it('should construct receipts with info', () => {
    const expected = receiptsWithInfo;
    expect(receiptsWithInfoSelector(storeMock)).toEqual(expected);
  });

  it('should set all addresses to loading when supported assets are loading', () => {
    const mockedState = storeMock.setIn(['hubiiApiHoc', 'supportedAssets', 'loading'], true);
    const expected = receiptsWithInfo
      .map((address) => address
        .set('loading', true)
        .set('receipts', fromJS([])));
    expect(receiptsWithInfoSelector(mockedState)).toEqual(expected);
  });

  xit('should set all addresses to loading when prices are loading', () => {
    const mockedState = storeMock.setIn(['hubiiApiHoc', 'prices', 'loading'], true);
    const expected = receiptsWithInfo
      .map((address) => address
        .set('loading', true)
        .set('receipts', fromJS([])));
    expect(receiptsWithInfoSelector(mockedState)).toEqual(expected);
  });

  xit('should set all addresses to loading when prices are errored', () => {
    const mockedState = storeMock.setIn(['hubiiApiHoc', 'prices', 'error'], true);
    const expected = receiptsWithInfo
      .map((address) => address
        .set('loading', true)
        .set('receipts', fromJS([])));
    expect(receiptsWithInfoSelector(mockedState)).toEqual(expected);
  });

  it('should set all addresses to loading when supported assets are errored', () => {
    const mockedState = storeMock.setIn(['hubiiApiHoc', 'supportedAssets', 'error'], true);
    const expected = receiptsWithInfo
      .map((address) => address
        .set('loading', true)
        .set('receipts', fromJS([])));
    expect(receiptsWithInfoSelector(mockedState)).toEqual(expected);
  });
});

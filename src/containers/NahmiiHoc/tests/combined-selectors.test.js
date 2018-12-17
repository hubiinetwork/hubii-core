import { fromJS } from 'immutable';

import { storeMock } from 'mocks/store';

import {
  transactionsWithInfoMock,
} from 'containers/HubiiApiHoc/tests/mocks/selectors';

import {
  receiptsWithInfo,
} from 'containers/NahmiiHoc/tests/mocks/selectors';

import {
  makeSelectCombinedTransactions,
} from '../combined-selectors';

import {
  combinedTransactions,
} from './mocks/combined-selectors';

describe('makeSelectCombinedTransactions', () => {
  const combinedTransactionsSelector = makeSelectCombinedTransactions();
  it.only('should combine base layer and nahmii transactions correctly', () => {
    const expected = combinedTransactions;
    expect(combinedTransactionsSelector(storeMock)).toEqual(expected);
  });

  it('should correctly handle when when no nahmii receipts', () => {
    const testState = storeMock.setIn(
      ['nahmiiHoc', 'receipts', '0x1c7429f62595097315289ceBaC1fDbdA587Ad512', 'receipts'],
      fromJS([])
    );
    const expected = transactionsWithInfoMock
      .setIn(['0xF4db7c6030c9c5754A6A712212d6342DCA52e25d', 'loading'], true);
    expect(combinedTransactionsSelector(testState)).toEqual(expected);
  });

  it('should correctly handle when when no baselayer receipts', () => {
    const testState = storeMock.setIn(
      ['hubiiApiHoc', 'transactions', '0x1c7429f62595097315289ceBaC1fDbdA587Ad512', 'transactions'],
      fromJS([])
    );
    const expected = receiptsWithInfo.setIn(
      ['0x1c7429f62595097315289ceBaC1fDbdA587Ad512', 'transactions'],
      receiptsWithInfo.getIn(['0x1c7429f62595097315289ceBaC1fDbdA587Ad512', 'receipts'])
    ).deleteIn(
      ['0x1c7429f62595097315289ceBaC1fDbdA587Ad512', 'receipts']
    ).setIn(
      ['0x82191e2863E0b6AFC0A7D538cdabfd509aA648b5'],
      fromJS({ loading: true, error: null, transactions: [] })
    ).setIn(
      ['0xF4db7c6030c9c5754A6A712212d6342DCA52e25d'],
      fromJS({ loading: true, error: true, transactions: [] })
    ).setIn(
      ['0x2ba8dc656a85d6d36f93c5e2e17ca910efa5faeb'],
      fromJS({ loading: true, error: null, transactions: [] })
    );
    expect(combinedTransactionsSelector(testState)).toEqual(expected);
  });
});

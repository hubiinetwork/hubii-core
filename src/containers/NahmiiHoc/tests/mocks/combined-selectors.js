import { fromJS } from 'immutable';

import {
  transactionsWithInfoMock,
} from 'containers/HubiiApiHoc/tests/mocks/selectors';

import {
  receiptsWithInfo,
} from '../mocks/selectors';

// makeSelectCombinedTransactions
export const combinedTransactions = fromJS({
  '0x1c7429f62595097315289ceBaC1fDbdA587Ad512': {
    loading: false,
    error: null,
    transactions: receiptsWithInfo
      .getIn(['0x1c7429f62595097315289ceBaC1fDbdA587Ad512', 'receipts']).slice(0, 1)
      .concat(transactionsWithInfoMock.getIn(['0x1c7429f62595097315289ceBaC1fDbdA587Ad512', 'transactions']).slice(0, 1))
      .concat(receiptsWithInfo.getIn(['0x1c7429f62595097315289ceBaC1fDbdA587Ad512', 'receipts']).slice(1, 2))
      .concat(transactionsWithInfoMock.getIn(['0x1c7429f62595097315289ceBaC1fDbdA587Ad512', 'transactions']).slice(1, 2)),
  },
  '0xF4db7c6030c9c5754A6A712212d6342DCA52e25d': {
    loading: false,
    error: true,
    transactions: fromJS([]),
  },
  '0x82191e2863E0b6AFC0A7D538cdabfd509aA648b5': {
    loading: true,
    error: null,
    transactions: fromJS([]),
  },
  '0x2ba8dc656a85d6d36f93c5e2e17ca910efa5faeb': {
    loading: true,
    error: null,
    transactions: fromJS([]),
  },
});

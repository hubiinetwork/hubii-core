import { fromJS } from 'immutable';

import { walletsMock } from 'containers/WalletHoc/tests/mocks/selectors';
// import BigNumber from 'bignumber.js';

import {
  balanceState,
  totalExpected,
} from './index';

// makeSelectNahmiiBalances
export const balancesEmpty = fromJS({});
export const balances = balanceState
  .setIn([walletsMock.getIn([0, 'address']), 'total'], totalExpected)
  .setIn([walletsMock.getIn([1, 'address']), 'total'], totalExpected.set('assets', fromJS([])))
  .setIn([walletsMock.getIn([2, 'address']), 'total'], totalExpected.set('assets', fromJS([])).set('error', 'someerror'))
  .setIn([walletsMock.getIn([3, 'address']), 'total'], totalExpected.set('assets', fromJS([])).set('loading', true));

// selectNahmiiHocDomain
export const nahmiiHocMock = fromJS({
  balances: balanceState,
});

import { fromJS } from 'immutable';
// import BigNumber from 'bignumber.js';

import {
  balanceState,
  totalExpected,
} from './index';

// makeSelectNahmiiBalances
export const balancesEmpty = fromJS({});
export const balances = balanceState
  .setIn(['0x01', 'total'], totalExpected)
  .setIn(['0x02', 'total'], totalExpected.set('assets', fromJS([])))
  .setIn(['0x03', 'total'], totalExpected.set('assets', fromJS([])).set('error', 'someerror'))
  .setIn(['0x04', 'total'], totalExpected.set('assets', fromJS([])).set('loading', true));

// selectNahmiiHocDomain
export const nahmiiHocMock = fromJS({
  balances: balanceState,
});


import { fromJS } from 'immutable';
import striimAccountsReducer from '../reducer';

import {
  loadStriimAccounts,
  striimAccountsLoaded,
  striimAccountsLoadingError,
  changeCurrentCurrency,
  changeCurrentAccount,
} from '../actions';

describe('striimAccountsReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      loading: true,
      error: null,
      data: [],
      currentAccount: {},
      currentCurrency: {},
    });
  });

  it('returns the initial state', () => {
    expect(striimAccountsReducer(undefined, {})).toEqual(state);
  });

  it('should handle loadStriimAccounts action correctly', () => {
    const expected = state.set('loading', true);

    expect(striimAccountsReducer(state, loadStriimAccounts())).toEqual(expected);
  });

  it('should handle striimAccountsLoaded action correctly', () => {
    const striimAccounts = fromJS([{ balances: { asset: 'HBT' } }, { balances: { asset: 'ETH' } }]);
    const expected = state
      .set('loading', false)
      .set('error', null)
      .set('data', striimAccounts)
      .set('currentAccount', striimAccounts.get(0))
      .set('currentCurrency', striimAccounts.get(0).get('balances').get(0));
    expect(striimAccountsReducer(state, striimAccountsLoaded(striimAccounts.toJS()))).toEqual(expected);
  });

  it('should handle striimAccountLoadingError action correctly', () => {
    const error = 'Something went wrong!';
    const expected = state
      .set('loading', false)
      .set('error', error);

    expect(striimAccountsReducer(state, striimAccountsLoadingError(error))).toEqual(expected);
  });

  it('should handle changeCurrentAccount action correctly', () => {
    const striimAccounts = fromJS([{ balances: [{ asset: 'HBT' }] }, { balances: [{ asset: 'ETH' }] }]);
    const currentAccount = striimAccounts.get(0);
    const expected = state
      .set('currentAccount', currentAccount)
      .set('currentCurrency', currentAccount.get('balances').get(0));
    expect(striimAccountsReducer(state, changeCurrentAccount(currentAccount.toJS()))).toEqual(expected);
  });

  it('should handle changeCurrentCurrency action correctly', () => {
    const currentAccount = fromJS({ balances: [{ asset: 'HBT' }, { asset: 'ETH' }] });
    const expected = state
      .set('currentCurrency', currentAccount.get('balances').get(1));
    expect(striimAccountsReducer(state, changeCurrentCurrency(currentAccount.get('balances').get(1).toJS()))).toEqual(expected);
  });
});

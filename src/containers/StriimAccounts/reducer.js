import { fromJS } from 'immutable';

import {
  LOAD_STRIIM_ACCOUNTS,
  LOAD_STRIIM_ACCOUNTS_SUCCESS,
  LOAD_STRIIM_ACCOUNTS_FAILURE,
  CHANGE_CURRENT_ACCOUNT,
  CHANGE_CURRENT_CURRENCY,
} from './constants';

const initialState = fromJS({
  loading: true,
  error: null,
  data: [],
  currentAccount: {},
  currentCurrency: {},
});

function striimAccountsReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_STRIIM_ACCOUNTS:
      return state
        .set('loading', true);
    case LOAD_STRIIM_ACCOUNTS_SUCCESS:
      return state
        .set('data', fromJS(action.striimAccounts))
        .set('currentAccount', fromJS(action.striimAccounts[0]))
        .set('currentCurrency', fromJS(action.striimAccounts[0].balances[0]))
        .set('error', null)
        .set('loading', false);
    case LOAD_STRIIM_ACCOUNTS_FAILURE:
      return state
        .set('loading', false)
        .set('error', action.error);
    case CHANGE_CURRENT_ACCOUNT:
      return state
        .set('currentAccount', fromJS(action.account))
        .set('currentCurrency', fromJS(action.account.balances[0]));
    case CHANGE_CURRENT_CURRENCY:
      return state
        .set('currentCurrency', fromJS(action.currency));
    default:
      return state;
  }
}

export default striimAccountsReducer;

import {
  LOAD_STRIIM_ACCOUNTS,
  LOAD_STRIIM_ACCOUNTS_SUCCESS,
  LOAD_STRIIM_ACCOUNTS_FAILURE,
  CHANGE_CURRENT_ACCOUNT,
  CHANGE_CURRENT_CURRENCY,
} from './constants';

export function loadStriimAccounts() {
  return {
    type: LOAD_STRIIM_ACCOUNTS,
  };
}

export function striimAccountsLoaded(striimAccounts) {
  return {
    type: LOAD_STRIIM_ACCOUNTS_SUCCESS,
    striimAccounts,
  };
}

export function striimAccountsLoadingError(error) {
  return {
    type: LOAD_STRIIM_ACCOUNTS_FAILURE,
    error,
  };
}

export function changeCurrentCurrency(currency) {
  return {
    type: CHANGE_CURRENT_CURRENCY,
    currency,
  };
}

export function changeCurrentAccount(account) {
  return {
    type: CHANGE_CURRENT_ACCOUNT,
    account,
  };
}

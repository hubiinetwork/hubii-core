import {
  LOAD_STRIIM_ACCOUNTS,
  LOAD_STRIIM_ACCOUNTS_SUCCESS,
  LOAD_STRIIM_ACCOUNTS_FAILURE,
} from '../constants';

import {
  loadStriimAccounts,
  striimAccountsLoaded,
  striimAccountsLoadingError,
} from '../actions';

describe('Striim Accounts Actions', () => {
  describe('loadStriimAccounts', () => {
    it('should return the correct type', () => {
      const expected = {
        type: LOAD_STRIIM_ACCOUNTS,
      };

      expect(loadStriimAccounts()).toEqual(expected);
    });
  });

  describe('striimAccountsLoaded', () => {
    it('should return the correct type and the passed accounts', () => {
      const striimAccounts = [{ id: 1 }, { id: 2 }];
      const expected = {
        type: LOAD_STRIIM_ACCOUNTS_SUCCESS,
        striimAccounts,
      };

      expect(striimAccountsLoaded(striimAccounts)).toEqual(expected);
    });
  });

  describe('striimAccountsLoadingError', () => {
    it('should return the correct type and the error', () => {
      const error = 'Something went wrong!';
      const expected = {
        type: LOAD_STRIIM_ACCOUNTS_FAILURE,
        error,
      };

      expect(striimAccountsLoadingError(error)).toEqual(expected);
    });
  });
});

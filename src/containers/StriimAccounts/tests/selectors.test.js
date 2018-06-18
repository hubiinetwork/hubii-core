import { fromJS } from 'immutable';

import selectStriimAccountsDomain, {
  makeSelectLoading,
  makeSelectError,
  makeSelectCurrentAccount,
  makeSelectCurrentCurrency,
} from '../selectors';

describe('selectStriimAccountsDomain', () => {
  it('should select the striimAccounts state', () => {
    const mockState = fromJS({
      striimAccounts: [{ balances: [] }],
    });
    const striimAccountsState = mockState.get('striimAccounts');
    expect(selectStriimAccountsDomain(mockState)).toEqual(striimAccountsState);
  });
});

describe('selectError', () => {
  const errorSelector = makeSelectError();
  it('should select error state', () => {
    const error = new Error();
    const mockedState = fromJS({
      striimAccounts: {
        error,
      },
    });
    expect(errorSelector(mockedState)).toEqual(error);
  });
});

describe('makeSelectLoading', () => {
  const loadingSelector = makeSelectLoading();
  it('should correctly select loading when loading is true', () => {
    const loading = true;
    const mockedState = fromJS({
      striimAccounts: {
        loading,
      },
    });
    expect(loadingSelector(mockedState)).toEqual(loading);
  });

  it('should correctly select loading when loading is false', () => {
    const loading = false;
    const mockedState = fromJS({
      striimAccounts: {
        loading,
      },
    });
    expect(loadingSelector(mockedState)).toEqual(loading);
  });
});

describe('makeSelectCurrentAccount', () => {
  it('should correctly select currentAccount', () => {
    const currentAccountSelector = makeSelectCurrentAccount();
    const currentAccount = fromJS({ balances: [] });
    const mockedState = fromJS({
      striimAccounts: {
        currentAccount: currentAccount.toJS(),
      },
    });
    expect(currentAccountSelector(mockedState)).toEqual(currentAccount);
  });
});

describe('makeSelectCurrentCurrency', () => {
  it('should correctly select currentAccount', () => {
    const currentCurrencySelector = makeSelectCurrentCurrency();
    const currentCurrency = fromJS({ asset: 'hbt' });
    const mockedState = fromJS({
      striimAccounts: {
        currentCurrency: currentCurrency.toJS(),
      },
    });
    expect(currentCurrencySelector(mockedState)).toEqual(currentCurrency);
  });
});

import { createSelector } from 'reselect';

const selectStriimAccountsDomain = (state) => state.get('striimAccounts');

const makeSelectLoading = () => createSelector(
  selectStriimAccountsDomain,
  (striimAccountsDomain) => striimAccountsDomain.get('loading')
);

const makeSelectError = () => createSelector(
  selectStriimAccountsDomain,
  (striimAccountsDomain) => striimAccountsDomain.get('error')
);

const makeSelectAccounts = () => createSelector(
  selectStriimAccountsDomain,
  (striimAccountsDomain) => striimAccountsDomain.get('data')
);

const makeSelectCurrentAccount = () => createSelector(
  selectStriimAccountsDomain,
  (striimAccountsDomain) => striimAccountsDomain.get('currentAccount')
);

const makeSelectCurrentCurrency = () => createSelector(
  selectStriimAccountsDomain,
  (striimAccountsDomain) => striimAccountsDomain.get('currentCurrency')
);

export default selectStriimAccountsDomain;
export {
  makeSelectLoading,
  makeSelectAccounts,
  makeSelectError,
  makeSelectCurrentAccount,
  makeSelectCurrentCurrency,
};

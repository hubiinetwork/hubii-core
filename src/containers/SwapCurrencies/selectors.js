import { createSelector } from 'reselect';

/**
 * Direct selector to the depositPage state domain
 */
const selectDepositPageDomain = (state) => state.get('depositPage');

/**
 * Other specific selectors
 */

const makeSelectLoading = () => createSelector(
  selectDepositPageDomain,
  (depositPageDomain) => depositPageDomain.get('loading')
);

const makeSelectError = () => createSelector(
  selectDepositPageDomain,
  (depositPageDomain) => depositPageDomain.get('error')
);

const makeSelectDepositInfo = () => createSelector(
  selectDepositPageDomain,
  (depositPageDomain) => depositPageDomain.get('depositInfo')
);

export default selectDepositPageDomain;
export {
  makeSelectLoading,
  makeSelectDepositInfo,
  makeSelectError,
};

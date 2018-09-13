import { createSelector } from 'reselect';

/**
 * Direct selector to the ledgerHoc state domain
 */
const selectLedgerHocDomain = (state) => state.get('ledgerHoc');

/**
 * Default selector used by LedgerHoc
 */
const makeSelectLedgerHoc = () => createSelector(
  selectLedgerHocDomain,
  (substate) => substate
);

export {
  makeSelectLedgerHoc,
};

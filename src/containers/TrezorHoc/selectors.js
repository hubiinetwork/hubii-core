import { createSelector } from 'reselect';

/**
 * Direct selector to the trezorHoc state domain
 */
const selectTrezorHocDomain = (state) => state.get('trezorHoc');

/**
 * Default selector used by TrezorHoc
 */
const makeSelectTrezorHoc = () => createSelector(
  selectTrezorHocDomain,
  (substate) => substate
);

export {
  makeSelectTrezorHoc,
};

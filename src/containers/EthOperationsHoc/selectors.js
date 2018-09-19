import { createSelector } from 'reselect';


/**
 * Direct selector to the ethOperationsHoc state domain
 */
const selectEthOperationsHocDomain = (state) => state.get('ethOperationsHoc');

/**
 * Other selectors
 */
const makeSelectBlockHeight = () => createSelector(
  selectEthOperationsHocDomain,
  (ethOperationsHocDomain) => ethOperationsHocDomain.get('blockHeight')
);

export {
  makeSelectBlockHeight,
};

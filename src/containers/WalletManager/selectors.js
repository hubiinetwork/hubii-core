import { createSelector } from 'reselect';

/**
 * Direct selector to the walletManager state domain
 */
const selectWalletManagerDomain = (state) => state.get('walletManager');

/**
 * Other specific selectors
 */
const makeSelectPasswordInput = () => createSelector(
  selectWalletManagerDomain,
  (depositPageDomain) => depositPageDomain.get('passwordInput')
);


/**
 * Default selector used by WalletManager
 */

const makeSelectWalletManager = () => createSelector(
  selectWalletManagerDomain,
  (substate) => substate.toJS()
);

export default makeSelectWalletManager;
export {
  selectWalletManagerDomain,
};

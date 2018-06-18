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
  (depositPageDomain) => depositPageDomain.getIn(['inputs', 'password'])
);

const makeSelectDerivationPathInput = () => createSelector(
  selectWalletManagerDomain,
  (depositPageDomain) => depositPageDomain.getIn(['inputs', 'derivationPath'])
);

const makeSelectNewWalletNameInput = () => createSelector(
  selectWalletManagerDomain,
  (depositPageDomain) => depositPageDomain.getIn(['inputs', 'newWalletNameInput'])
);

const makeSelectSelectedWalletName = () => createSelector(
  selectWalletManagerDomain,
  (depositPageDomain) => depositPageDomain.get('selectedWalletName')
);

const makeSelectWallets = () => createSelector(
  selectWalletManagerDomain,
  (depositPageDomain) => depositPageDomain.get('wallets')
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
  makeSelectNewWalletNameInput,
  makeSelectPasswordInput,
  makeSelectSelectedWalletName,
  makeSelectWallets,
  makeSelectDerivationPathInput,
};

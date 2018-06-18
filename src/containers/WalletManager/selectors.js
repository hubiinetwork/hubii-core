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
  (depositPageDomain) => depositPageDomain.getIn(['inputs', 'newWalletName'])
);

const makeSelectSelectedWalletName = () => createSelector(
  selectWalletManagerDomain,
  (depositPageDomain) => depositPageDomain.get('selectedWalletName')
);

const makeSelectWallets = () => createSelector(
  selectWalletManagerDomain,
  (depositPageDomain) => depositPageDomain.get('wallets')
);

export {
  selectWalletManagerDomain,
  makeSelectNewWalletNameInput,
  makeSelectPasswordInput,
  makeSelectSelectedWalletName,
  makeSelectWallets,
  makeSelectDerivationPathInput,
};

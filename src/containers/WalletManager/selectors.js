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
  (walletManagerDomain) => walletManagerDomain.getIn(['inputs', 'password'])
);

const makeSelectDerivationPathInput = () => createSelector(
  selectWalletManagerDomain,
  (walletManagerDomain) => walletManagerDomain.getIn(['inputs', 'derivationPath'])
);

const makeSelectNewWalletNameInput = () => createSelector(
  selectWalletManagerDomain,
  (walletManagerDomain) => walletManagerDomain.getIn(['inputs', 'newWalletName'])
);

const makeSelectSelectedWalletName = () => createSelector(
  selectWalletManagerDomain,
  (walletManagerDomain) => walletManagerDomain.get('selectedWalletName')
);

const makeSelectWallets = () => createSelector(
  selectWalletManagerDomain,
  (walletManagerDomain) => walletManagerDomain.get('wallets')
);

const makeSelectLoading = () => createSelector(
  selectWalletManagerDomain,
  (walletManagerDomain) => walletManagerDomain.get('loading')
);

const makeSelectErrors = () => createSelector(
  selectWalletManagerDomain,
  (walletManagerDomain) => walletManagerDomain.get('errors')
);

export {
  selectWalletManagerDomain,
  makeSelectNewWalletNameInput,
  makeSelectPasswordInput,
  makeSelectSelectedWalletName,
  makeSelectWallets,
  makeSelectDerivationPathInput,
  makeSelectLoading,
  makeSelectErrors,
};

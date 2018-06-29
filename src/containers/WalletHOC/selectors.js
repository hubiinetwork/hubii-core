import { createSelector } from 'reselect';
import { convertWalletsList } from 'utils/wallet';

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

const makeSelectCurrentWallet = () => createSelector(
  selectWalletManagerDomain,
  (walletManagerDomain) => walletManagerDomain.get('currentWallet')
);

const makeSelectWalletList = () => createSelector(
  makeSelectWallets(),
  (walletsState) => convertWalletsList(walletsState)
);

const makeSelectCurrentWalletDetails = () => createSelector(
  makeSelectWalletList(),
  makeSelectCurrentWallet(),
  (walletList, currentWallet) => walletList.find((wallet) => `0x${wallet.encrypted.address}` === currentWallet.toJS().address) || {}
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
  makeSelectCurrentWallet,
  makeSelectWalletList,
  makeSelectCurrentWalletDetails,
};

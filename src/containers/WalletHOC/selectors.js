import { createSelector } from 'reselect';
import { convertWalletsList, IsAddressMatch } from 'utils/wallet';

/**
 * Direct selector to the walletHoc state domain
 */
const selectWalletHocDomain = (state) => state.get('walletHoc');

/**
 * Other specific selectors
 */
const makeSelectPasswordInput = () => createSelector(
  selectWalletHocDomain,
  (walletHocDomain) => walletHocDomain.getIn(['inputs', 'password'])
);

const makeSelectDerivationPathInput = () => createSelector(
  selectWalletHocDomain,
  (walletHocDomain) => walletHocDomain.getIn(['inputs', 'derivationPath'])
);

const makeSelectNewWalletNameInput = () => createSelector(
  selectWalletHocDomain,
  (walletHocDomain) => walletHocDomain.getIn(['inputs', 'newWalletName'])
);

const makeSelectSelectedWalletName = () => createSelector(
  selectWalletHocDomain,
  (walletHocDomain) => walletHocDomain.get('selectedWalletName')
);

const makeSelectWallets = () => createSelector(
  selectWalletHocDomain,
  (walletHocDomain) => walletHocDomain.get('wallets')
);

const makeSelectLoading = () => createSelector(
  selectWalletHocDomain,
  (walletHocDomain) => walletHocDomain.get('loading')
);

const makeSelectErrors = () => createSelector(
  selectWalletHocDomain,
  (walletHocDomain) => walletHocDomain.get('errors')
);

const makeSelectCurrentWallet = () => createSelector(
  selectWalletHocDomain,
  (walletHocDomain) => walletHocDomain.get('currentWallet')
);

const makeSelectWalletList = () => createSelector(
  makeSelectWallets(),
  (walletsState) => convertWalletsList(walletsState)
);

const makeSelectCurrentWalletDetails = () => createSelector(
  makeSelectWalletList(),
  makeSelectCurrentWallet(),
  (walletList, currentWallet) => {
    const walletDetails = walletList.find((wallet) => `0x${wallet.encrypted.address}` === currentWallet.toJS().address);
    return walletDetails || {};
  }
);

const makeSelectPendingTransactions = () => createSelector(
  selectWalletHocDomain,
  (walletHocDomain) => walletHocDomain.get('pendingTransactions')
);

const makeSelectConfirmedTransactions = () => createSelector(
  selectWalletHocDomain,
  (walletHocDomain) => walletHocDomain.get('confirmedTransactions')
);

const makeSelectAllTransactions = () => createSelector(
  makeSelectCurrentWalletDetails(),
  makeSelectPendingTransactions(),
  makeSelectConfirmedTransactions(),
  (currentWalletDetails, pendingTxns, confirmedTxns) => {
    const txns = [].concat(pendingTxns.toJS()).concat(confirmedTxns.toJS());
    return txns.filter((txn) => {
      const address = currentWalletDetails.address;
      return IsAddressMatch(txn.from, address) || IsAddressMatch(txn.to, address);
    }).sort((a, b) => b.timestamp - a.timestamp);
  }
);

export {
  selectWalletHocDomain,
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
  makeSelectAllTransactions,
};

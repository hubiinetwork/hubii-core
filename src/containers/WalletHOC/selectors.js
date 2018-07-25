import { createSelector } from 'reselect';
import { referenceCurrencies, IsAddressMatch } from 'utils/wallet';
import { fromJS } from 'immutable';

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

const makeSelectLedgerNanoSInfo = () => createSelector(
  selectWalletHocDomain,
  (walletHocDomain) => walletHocDomain.get('ledgerNanoSInfo')
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

const makeSelectBalances = () => createSelector(
  selectWalletHocDomain,
  (walletHocDomain) => walletHocDomain.get('balances')
);

const makeSelectTotalBalances = () => createSelector(
  makeSelectBalances(),
  makeSelectSupportedAssets(),
  (balances, supportedAssets) => {
    let totalBalances = fromJS({});
    // console.log(balances.valueSeq());
    balances.valueSeq().forEach((address) => {
      address.get('assets').forEach((balance) => {
        console.log(supportedAssets.toJS());
        const currency = balance.get('currency');
        totalBalances = totalBalances
          .set(currency, totalBalances.get(currency) + balance.get('balance'));
      });
    });

    console.log(totalBalances.toJS());
    return totalBalances;
  }
);

const makeSelectPrices = () => createSelector(
  selectWalletHocDomain,
  (walletHocDomain) => walletHocDomain.get('prices')
);

const makeSelectSupportedAssets = () => createSelector(
  selectWalletHocDomain,
  (walletHocDomain) => walletHocDomain.get('supportedAssets')
);

const makeSelectWalletsWithInfo = () => createSelector(
  makeSelectWallets(),
  makeSelectBalances(),
  makeSelectPrices(),
  makeSelectSupportedAssets(),
  (wallets, balances, prices, supportedAssets) => {
    const walletsWithInfo = wallets.map((wallet) => {
      let walletWithInfo = wallet;

      // Add balance info for each token
      let walletBalances = balances.get(wallet.get('address'));
      if (!walletBalances) {
        walletBalances = [];
      } else if (walletBalances.get('loading')) {
        walletBalances = walletBalances.set('loading', true);
      } else {
        walletBalances = walletBalances.set('assets', walletBalances.get('assets').map((asset) => {
          let walletAsset = asset;
          const supportedAssetIndex = supportedAssets
            .get('assets')
            .findIndex((t) => t.get('currency') === asset.get('currency'));

          const priceIndex = prices
            .get('assets')
            .findIndex((t) => t.get('currency') === asset.get('currency'));


          const supportedAssetInfo = supportedAssets.getIn(['assets', supportedAssetIndex]);

          const priceInfo = prices.getIn(['assets', priceIndex]);

          // Remove redundant value
          walletAsset = walletAsset.delete('address');

          // Get real balance
          const realBalance = walletAsset.get('balance') / (10 ** supportedAssetInfo.get('decimals'));
          walletAsset = walletAsset.set('balance', realBalance);

          // Add symbol for each asset
          const symbol = supportedAssetInfo.get('symbol');
          walletAsset = walletAsset.set('symbol', symbol);

          // Add reference currency values for each asset
          referenceCurrencies.forEach((currency) => {
            walletAsset = walletAsset
            .setIn(['value', currency], priceInfo.get(currency) * walletAsset.get('balance'));
          });

          return walletAsset;
        }));

        // Add total balance info for each wallet
        referenceCurrencies.forEach((currency) => {
          walletBalances = walletBalances
            .setIn(['total', currency], walletBalances.get('assets').reduce((acc, asset) => acc + asset.getIn(['value', currency]), 0));
        });
      }

      walletWithInfo = walletWithInfo.set('balances', walletBalances);
      return walletWithInfo;
    });

    return walletsWithInfo;
  }
);

const makeSelectCurrentWalletDetails = () => createSelector(
  makeSelectWallets(),
  makeSelectCurrentWallet(),
  (wallets, currentWallet) => {
    const currentWalletIndex = wallets.findIndex((w) => w.get('address') === currentWallet.get('address'));
    if (currentWalletIndex === -1) return {};

    const walletDetails = wallets.get(currentWalletIndex);
    return walletDetails;
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
  makeSelectLedgerNanoSInfo,
  makeSelectTotalBalances,
  makeSelectNewWalletNameInput,
  makeSelectPasswordInput,
  makeSelectSelectedWalletName,
  makeSelectWallets,
  makeSelectDerivationPathInput,
  makeSelectLoading,
  makeSelectErrors,
  makeSelectCurrentWallet,
  makeSelectWalletsWithInfo,
  makeSelectCurrentWalletDetails,
  makeSelectAllTransactions,
};

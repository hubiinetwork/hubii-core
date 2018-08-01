import { createSelector } from 'reselect';
import { referenceCurrencies } from 'utils/wallet';
import { fromJS } from 'immutable';
import BigNumber from 'bignumber.js';

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

// returns balances state OR a placeholder if the app state is from an old version and needs to reinitialise
const makeSelectBalances = () => createSelector(
  selectWalletHocDomain,
  (walletHocDomain) => walletHocDomain.get('balances') || fromJS({})
);

const makeSelectTotalBalances = () => createSelector(
  makeSelectWallets(),
  makeSelectBalances(),
  makeSelectPrices(),
  makeSelectSupportedAssets(),
  (wallets, balances, prices, supportedAssets) => {
    if (
      supportedAssets.get('loading') ||
      prices.get('loading') ||
      supportedAssets.get('error') ||
      prices.get('error')
    ) {
      return fromJS({ assets: {}, loading: true, totalUsd: new BigNumber('0') });
    }

    // Caclulate total amount and value of each asset
    let totalBalances = fromJS({ assets: {}, loading: false, totalUsd: new BigNumber('0') });
    balances.keySeq().forEach((address) => {
      // Check address balance is avaliable, and owned by the user
      const addressBalances = balances.get(address);
      if (
        !addressBalances ||
        addressBalances.get('error') ||
        addressBalances.get('loading') ||
        !wallets.find((w) => w.get('address') === address)
      ) return;

      // Look through each address's, summing the balances for each token
      addressBalances.get('assets').forEach((balance) => {
        const currency = balance.get('currency');
        const decimals = supportedAssets.get('assets').find((asset) => asset.get('currency') === currency).get('decimals');

        const divisionFactor = new BigNumber('10').pow(decimals);
        const thisBalance = new BigNumber(balance.get('balance')).dividedBy(divisionFactor);

        const prevAmount = totalBalances.getIn(['assets', currency, 'amount']) || new BigNumber('0');
        const nextAmount = prevAmount.plus(thisBalance);

        const price = prices.get('assets').find((p) => p.get('currency') === balance.get('currency')).get('usd');
        totalBalances = totalBalances.setIn(['assets', currency], fromJS({ amount: nextAmount, usdValue: nextAmount.times(price) }));
      });
    });

    // Calculate total USD value
    totalBalances.get('assets').keySeq().forEach((currency) => {
      const amount = totalBalances.getIn(['assets', currency, 'amount']);
      const price = prices.get('assets').find((p) => p.get('currency') === currency).get('usd');
      const value = amount.times(price);

      const prevAmount = totalBalances.get('totalUsd') || new BigNumber('0');
      totalBalances = totalBalances.set('totalUsd', prevAmount.plus(value));
    });
    return totalBalances;
  }
);

// returns prices state OR a placeholder if the app state is from an old version and needs to reinitialise
const makeSelectPrices = () => createSelector(
  selectWalletHocDomain,
  (walletHocDomain) => walletHocDomain.get('prices') || fromJS({ loading: true })
);

// returns supportedAssets state OR a placeholder if the app state is from an old version and needs to reinitialise
const makeSelectSupportedAssets = () => createSelector(
  selectWalletHocDomain,
  (walletHocDomain) => walletHocDomain.get('supportedAssets') || fromJS({ loading: true })
);

const makeSelectWalletsWithInfo = () => createSelector(
  makeSelectWallets(),
  makeSelectBalances(),
  makeSelectPrices(),
  makeSelectSupportedAssets(),
  (wallets, balances, prices, supportedAssets) => {
    const walletsWithInfo = wallets.map((wallet) => {
      let walletWithInfo = wallet;
      const walletAddress = wallet.get('address');
      let walletBalances;

      // Check if waiting on a response from the API, wallet balance should appear in 'loading' state
      if (
        supportedAssets.get('loading') ||
        prices.get('loading') ||
        !balances.get(walletAddress) ||
        balances.getIn([walletAddress, 'loading'])
      ) {
        walletBalances = fromJS({ loading: true, total: { usd: new BigNumber('0'), eth: new BigNumber('0'), btc: new BigNumber('0') } });
      } else if (
        // Check if recieved an error from any of the critical API responses
        supportedAssets.get('error') ||
        prices.get('error') ||
        balances.getIn([walletAddress, 'error'])
      ) {
        walletBalances = fromJS({ loading: false, error: true, total: { usd: new BigNumber('0'), eth: new BigNumber('0'), btc: new BigNumber('0') } });
      } else {
        // Have all information needed to construct walletWithInfo balance
        walletBalances = balances.get(wallet.get('address'));
        walletBalances = walletBalances.set('assets', walletBalances.get('assets').map((asset) => {
          let walletAsset = asset;

          const supportedAssetInfo = supportedAssets
            .get('assets')
            .find((a) => a.get('currency') === asset.get('currency'));
          const priceInfo = prices
            .get('assets')
            .find((p) => p.get('currency') === asset.get('currency'));

          // Remove redundant value
          walletAsset = walletAsset.delete('address');

          // Get decimal balance
          const dividingFactor = new BigNumber('10').pow(supportedAssetInfo.get('decimals'));
          const decimalBalance = new BigNumber(walletAsset.get('balance')).dividedBy(dividingFactor);
          walletAsset = walletAsset.set('balance', decimalBalance);

          // Add symbol for each asset
          const symbol = supportedAssetInfo.get('symbol');
          walletAsset = walletAsset.set('symbol', symbol);


          // Add reference currency values for each asset
          referenceCurrencies.forEach((currency) => {
            walletAsset = walletAsset
              .setIn(['value', currency], new BigNumber(priceInfo.get(currency)).times(walletAsset.get('balance')));
          });


          return walletAsset;
        }));

        // Add total balance info for each wallet
        referenceCurrencies.forEach((currency) => {
          walletBalances = walletBalances
            .setIn(['total', currency], walletBalances.get('assets').reduce((acc, asset) => acc.plus(asset.getIn(['value', currency])), new BigNumber('0')));
        });
      }

      walletWithInfo = walletWithInfo.set('balances', walletBalances);
      return walletWithInfo;
    });

    return walletsWithInfo;
  }
);

const makeSelectCurrentWalletWithInfo = () => createSelector(
  makeSelectWalletsWithInfo(),
  makeSelectCurrentWallet(),
  (wallets, currentWallet) => {
    const currentWalletIndex = wallets.findIndex((w) => w.get('address') === currentWallet.get('address'));
    if (currentWalletIndex === -1) return fromJS({});

    const walletDetails = wallets.get(currentWalletIndex);
    return walletDetails;
  }
);

const makeSelectCurrentDecryptionCallback = () => createSelector(
  selectWalletHocDomain,
  (walletHocDomain) => walletHocDomain.get('currentDecryptionCallback')
);

// const makeSelectAllTransactions = () => createSelector(
//   makeSelectCurrentWalletDetails(),
//   makeSelectPendingTransactions(),
//   makeSelectConfirmedTransactions(),
//   (currentWalletDetails, pendingTxns, confirmedTxns) => {
//     const txns = [].concat(pendingTxns.toJS()).concat(confirmedTxns.toJS());
//     return txns.filter((txn) => {
//       const address = currentWalletDetails.address;
//       return IsAddressMatch(txn.from, address) || IsAddressMatch(txn.to, address);
//     }).sort((a, b) => b.timestamp - a.timestamp);
//   }
// );

// const makeSelectPendingTransactions = () => createSelector(
//   selectWalletHocDomain,
//   (walletHocDomain) => walletHocDomain.get('pendingTransactions')
// );

// const makeSelectConfirmedTransactions = () => createSelector(
//   selectWalletHocDomain,
//   (walletHocDomain) => walletHocDomain.get('confirmedTransactions')
// );

// const makeSelectAllTransactions = () => createSelector(
//   makeSelectWalletsWithInfo(),
//   makeSelectPendingTransactions(),
//   makeSelectConfirmedTransactions(),
//   (currentWalletDetails, pendingTxns, confirmedTxns) => {
//     const txns = [].concat(pendingTxns.toJS()).concat(confirmedTxns.toJS());
//     return txns.filter((txn) => {
//       const address = currentWalletDetails.address;
//       return IsAddressMatch(txn.from, address) || IsAddressMatch(txn.to, address);
//     }).sort((a, b) => b.timestamp - a.timestamp);
//   }
// );

export {
  selectWalletHocDomain,
  makeSelectLedgerNanoSInfo,
  makeSelectTotalBalances,
  makeSelectNewWalletNameInput,
  makeSelectPasswordInput,
  makeSelectSelectedWalletName,
  makeSelectSupportedAssets,
  makeSelectPrices,
  makeSelectWallets,
  makeSelectDerivationPathInput,
  makeSelectBalances,
  makeSelectLoading,
  makeSelectErrors,
  makeSelectCurrentWallet,
  makeSelectWalletsWithInfo,
  makeSelectCurrentWalletWithInfo,
  makeSelectCurrentDecryptionCallback,
};

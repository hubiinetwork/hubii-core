import { createSelector } from 'reselect';
import { referenceCurrencies } from 'utils/wallet';
import { fromJS, List } from 'immutable';
import BigNumber from 'bignumber.js';

import {
  makeSelectBalances as makeSelectBaseLayerBalances,
  makeSelectSupportedAssets,
  makeSelectPrices,
  makeSelectTransactionsWithInfo,
} from 'containers/HubiiApiHoc/selectors';

import {
  makeSelectNahmiiBalances,
} from 'containers/NahmiiHoc/selectors';

/**
 * Direct selector to the walletHoc state domain
 */
const selectWalletHocDomain = (state) => state.get('walletHoc');

/**
 * Other specific selectors
 */

const makeSelectDerivationPathInput = () => createSelector(
  selectWalletHocDomain,
  (walletHocDomain) => walletHocDomain.getIn(['inputs', 'derivationPath'])
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

const makeSelectTotalBalances = () => createSelector(
  makeSelectWallets(),
  makeSelectBaseLayerBalances(),
  makeSelectPrices(),
  makeSelectSupportedAssets(),
  (wallets, baseLayerBalances, prices, supportedAssets) => {
    if (
      supportedAssets.get('loading') ||
      prices.get('loading')
    ) {
      return fromJS({ baseLayer: { assets: {}, loading: true, error: null, total: { usd: new BigNumber('0') } } });
    }

    if (
      supportedAssets.get('error') ||
      prices.get('error')
    ) {
      return fromJS({ baseLayer: { assets: {}, loading: false, error: true, total: { usd: new BigNumber('0') } } });
    }

    // Caclulate total amount and value of each asset in each type of balance
    const allBalances = [['baseLayer', baseLayerBalances]];
    let totalBalances = fromJS({ baseLayer: { assets: {}, loading: false, total: { usd: new BigNumber('0') } } });
    allBalances.forEach(([balanceType, balances]) => {
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

          // try to locate the asset from supportedAssets
          const assetDetails = supportedAssets
            .get('assets')
            .find((a) => a.get('currency') === currency);

          // ignore unsupported assets
          if (!assetDetails) return;

          const decimals = assetDetails.get('decimals');

          const divisionFactor = new BigNumber('10').pow(decimals);
          const thisBalance = new BigNumber(balance.get('balance')).dividedBy(divisionFactor);

          const prevAmount = totalBalances.getIn([balanceType, 'assets', currency, 'amount']) || new BigNumber('0');
          const nextAmount = prevAmount.plus(thisBalance);

          const price = prices.get('assets').find((p) => p.get('currency') === balance.get('currency')).get('usd');
          totalBalances = totalBalances.setIn([balanceType, 'assets', currency], fromJS({ amount: nextAmount, value: { usd: nextAmount.times(price) } }));
        });
      });

      // Calculate total USD value
      totalBalances.getIn([balanceType, 'assets']).keySeq().forEach((currency) => {
        const amount = totalBalances.getIn([balanceType, 'assets', currency, 'amount']);
        const price = prices.get('assets').find((p) => p.get('currency') === currency).get('usd');
        const value = amount.times(price);

        const prevAmount = totalBalances.getIn([balanceType, 'total', 'usd']) || new BigNumber('0');
        totalBalances = totalBalances.setIn([balanceType, 'total', 'usd'], prevAmount.plus(value));
      });
    });
    return totalBalances;
  }
);

// Check if any critical selectors for getting balance info are in error state
const requiredDataHasError = (supportedAssets, prices, walletBalances) => (
  supportedAssets.get('error')
  || prices.get('error')
  || (walletBalances && walletBalances.get('error'))
);

// Check if any critical selectors for getting balance info are in loading state
const requiredDataLoading = (supportedAssets, prices, walletBalances) => (
  supportedAssets.get('loading')
  || prices.get('loading')
  || !walletBalances
  || walletBalances.get('loading')
);

const makeSelectWalletsWithInfo = () => createSelector(
  makeSelectWallets(),
  makeSelectBaseLayerBalances(),
  makeSelectNahmiiBalances(),
  makeSelectPrices(),
  makeSelectSupportedAssets(),
  makeSelectTransactionsWithInfo(),
  (wallets, baseLayerBalances, nahmiiBalances, prices, supportedAssets, transactions) => {
    const walletsWithInfo = wallets.map((wallet) => {
      let walletWithInfo = wallet;
      const walletAddress = wallet.get('address');
      let walletBalances;
      let walletTransactions;

      // Add wallet transactions
      if (!transactions.get(walletAddress) || transactions.getIn([walletAddress, 'loading'])) {
        // console.log(transactions.get(walletAddress));
        walletTransactions = fromJS({ loading: true, error: null, transactions: [] });
      } else if (transactions.getIn([walletAddress, 'error'])) {
        walletTransactions = fromJS({ loading: false, error: true, transactions: [] });
      } else {
        walletTransactions = fromJS({ loading: false, error: null, transactions: transactions.getIn([walletAddress, 'transactions']) });
      }
      walletWithInfo = walletWithInfo.set('transactions', walletTransactions);

      const allBalances = [['baseLayer', baseLayerBalances]];
      allBalances.forEach(([balanceType, balances]) => {
        if (requiredDataHasError(supportedAssets, prices, balances.get(walletAddress))) {
          walletBalances = fromJS({ loading: false, error: true, total: { usd: new BigNumber('0'), eth: new BigNumber('0'), btc: new BigNumber('0') } });
        } else if (requiredDataLoading(supportedAssets, prices, balances.get(walletAddress))) {
          walletBalances = fromJS({ loading: true, error: null, total: { usd: new BigNumber('0'), eth: new BigNumber('0'), btc: new BigNumber('0') } });
        } else {
          // Have all information needed to construct walletWithInfo balance
          walletBalances = balances.get(wallet.get('address'));
          walletBalances = walletBalances.set('assets', walletBalances.get('assets').reduce((result, asset) => {
            let walletAsset = asset;

            const supportedAssetInfo = supportedAssets
              .get('assets')
              .find((a) => a.get('currency') === asset.get('currency'));

            // ignore unsupported assets
            if (!supportedAssetInfo) return result;

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

            return result.push(walletAsset);
          }, new List()));

          // Add total balance info for each wallet
          referenceCurrencies.forEach((currency) => {
            walletBalances = walletBalances
              .setIn(['total', currency], walletBalances.get('assets').reduce((acc, asset) => acc.plus(asset.getIn(['value', currency])), new BigNumber('0')));
          });
        }
        walletWithInfo = walletWithInfo.setIn(['balances', balanceType], walletBalances);
      });

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

export {
  selectWalletHocDomain,
  makeSelectTotalBalances,
  makeSelectSelectedWalletName,
  makeSelectWallets,
  makeSelectDerivationPathInput,
  makeSelectLoading,
  makeSelectErrors,
  makeSelectCurrentWallet,
  makeSelectWalletsWithInfo,
  makeSelectCurrentWalletWithInfo,
  makeSelectCurrentDecryptionCallback,
};

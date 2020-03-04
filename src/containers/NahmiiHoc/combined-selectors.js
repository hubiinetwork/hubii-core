import { createSelector } from 'reselect';
import { fromJS, List } from 'immutable';
import BigNumber from 'bignumber.js';
import { referenceCurrencies, isAddressMatch } from 'utils/wallet';

/**
 * Selectors adding nahmii state to other sources
 */

import {
  makeSelectTransactionsWithInfo,
  makeSelectPrices,
  makeSelectSupportedAssets,
  makeSelectBalances as makeSelectBaseLayerBalances,
} from 'containers/HubiiApiHoc/selectors';
import {
  makeSelectWallets,
  makeSelectCurrentWallet,
} from 'containers/WalletHoc/selectors';
import {
  totalBalAllEmpty,
  totalBalAllError,
  totalBallAllLoading,
} from 'containers/WalletHoc/tests/mocks';
import {
  makeSelectReceiptsWithInfo,
  makeSelectNahmiiBalances,
} from './selectors';

const balanceTypes = (baseLayerBalances, nahmiiBalances) => [
  {
    label: 'baseLayer',
    balances: baseLayerBalances,
  },
  {
    label: 'nahmiiAvailable',
    key: 'available',
    balances: nahmiiBalances,
  },
  {
    label: 'nahmiiStaging',
    key: 'staging',
    balances: nahmiiBalances,
  },
  {
    label: 'nahmiiStaged',
    key: 'staged',
    balances: nahmiiBalances,
  },
];

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
  || !walletBalances.get('assets')
  || walletBalances.get('loading')
);

const findPriceInfo = (prices, currency) => {
  const priceInfo = prices
    .get('assets')
    .find((p) => isAddressMatch(p.get('currency'), currency));

  if (priceInfo) {
    return priceInfo;
  }
  return referenceCurrencies.reduce((result, referenceCurrency) => result.set(referenceCurrency, new BigNumber('0')), fromJS({}));
};

// given that the two arrays are already sorted we can use a greedy
// approach to go through each array and track the oldest element,
// each time adding it to a new merged array.
// O(n) time & O(n) space
// https://wsvincent.com/javascript-merge-two-sorted-arrays/
const mergeTransactions = (baseLayer, nahmii) => {
  const merged = [];
  let baseLayerIndex = 0;
  let nahmiiIndex = 0;
  let current = 0;

  while (current < (baseLayer.length + nahmii.length)) {
    const latestBaseLayer = baseLayer[baseLayerIndex];
    const latestNahmii = nahmii[nahmiiIndex];

    const baseLayerDepleted = !latestBaseLayer;
    const nahmiiDepleted = !latestNahmii;

    // if next comes from baseLayer
    if (nahmiiDepleted || (!baseLayerDepleted && latestBaseLayer.block.number > latestNahmii.blockNumber)) {
      merged[current] = latestBaseLayer;
      baseLayerIndex += 1;

    // if next comes from nahmii
    } else {
      merged[current] = latestNahmii;
      nahmiiIndex += 1;
    }

    current += 1;
  }

  return merged;
};

const makeSelectCombinedTransactions = () => createSelector(
  makeSelectTransactionsWithInfo(),
  makeSelectReceiptsWithInfo(),
  (baseLayerTransactions, nahmiiReceipts) => {
    const combinedTransactions = baseLayerTransactions.map((transactions, address) => {
      const baseLayer = transactions.get('transactions').toJS();
      let nahmii = [];
      if (nahmiiReceipts.getIn([address])) {
        nahmii = nahmiiReceipts.getIn([address, 'receipts']).toJS();
      }
      const merged = mergeTransactions(baseLayer, nahmii);
      const loading =
        !nahmiiReceipts.get(address)
        || nahmiiReceipts.getIn([address, 'loading'])
        || baseLayerTransactions.getIn([address, 'loading']);
      let error = null;
      if (!loading) {
        const nahmiiReceiptsError = nahmiiReceipts.get(address) && nahmiiReceipts.getIn([address, 'error']);
        const baseLayerTransactionsError = baseLayerTransactions.getIn([address, 'error']);
        if (nahmiiReceiptsError) error = nahmiiReceiptsError;
        if (baseLayerTransactionsError) error = baseLayerTransactionsError;
      }
      return fromJS({
        loading,
        error,
        transactions: merged,
      });
    });

    return fromJS(combinedTransactions.toJS());
  }
);

const makeSelectWalletsWithInfo = () => createSelector(
  makeSelectWallets(),
  makeSelectBaseLayerBalances(),
  makeSelectNahmiiBalances(),
  makeSelectPrices(),
  makeSelectSupportedAssets(),
  (wallets, baseLayerBalances, nahmiiBalances, prices, supportedAssets) => {
    const walletsWithInfo = wallets.map((wallet) => {
      let walletWithInfo = wallet;
      let walletBalances;

      balanceTypes(baseLayerBalances, nahmiiBalances).forEach(({ label, key, balances }) => {
        // Have all information needed to construct walletWithInfo balance
        walletBalances = key
          ? balances.getIn([wallet.get('address'), key])
          : balances.get(wallet.get('address'));
        if (requiredDataHasError(supportedAssets, prices, walletBalances)) {
          walletBalances = fromJS({ loading: false, error: true, assets: [], total: { usd: new BigNumber('0'), eth: new BigNumber('0'), btc: new BigNumber('0') } });
        } else if (requiredDataLoading(supportedAssets, prices, walletBalances)) {
          walletBalances = fromJS({ loading: true, error: null, assets: [], total: { usd: new BigNumber('0'), eth: new BigNumber('0'), btc: new BigNumber('0') } });
        } else {
          walletBalances = walletBalances.set('assets', walletBalances.get('assets').reduce((result, asset) => {
            let walletAsset = asset;
            const supportedAssetInfo = supportedAssets
              .get('assets')
              .find((a) => a.get('currency') === asset.get('currency'));

            // ignore unsupported assets
            if (!supportedAssetInfo) return result;

            const priceInfo = findPriceInfo(prices, asset.get('currency'));

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
        walletWithInfo = walletWithInfo.setIn(['balances', label], walletBalances);
      });

      // add a 'combined' balance type which is the sum of all different types of balance in the wallet
      const calcCombinedBalances = (...ignore) => {
        const combined = fromJS({
          loading: false,
          error: null,
          assets: [],
          total: { eth: new BigNumber('0'), btc: new BigNumber('0'), usd: new BigNumber('0') },
        });
        return walletWithInfo.get('balances').reduce((acc, balance, balanceType) => {
          if (ignore.includes(balanceType)) return acc;
          // if any of the wallet's assets are loading or errored out, set combined to the appropriate state
          if (acc.get('loading') || acc.get('error')) return acc;
          if (balance.get('loading')) {console.log(balanceType); return combined.set('loading', true); };
          if (balance.get('error')) return combined.set('error', true).set('assets', fromJS([]));
          return acc
            .setIn(['total', 'eth'], acc.getIn(['total', 'eth']).plus(balance.getIn(['total', 'eth'])))
            .setIn(['total', 'btc'], acc.getIn(['total', 'btc']).plus(balance.getIn(['total', 'btc'])))
            .setIn(['total', 'usd'], acc.getIn(['total', 'usd']).plus(balance.getIn(['total', 'usd'])))
            .set('assets', balance.get('assets').reduce((combinedAssets, asset) => {
              const index = combinedAssets.findIndex((existingAsset) => existingAsset.get('currency') === asset.get('currency'));
              if (index === -1) return combinedAssets.push(asset);
              return combinedAssets
                .setIn([index, 'balance'], combinedAssets.getIn([index, 'balance']).plus(asset.get('balance')))
                .setIn([index, 'value', 'eth'], combinedAssets.getIn([index, 'value', 'eth']).plus(asset.getIn(['value', 'eth'])))
                .setIn([index, 'value', 'usd'], combinedAssets.getIn([index, 'value', 'usd']).plus(asset.getIn(['value', 'usd'])))
                .setIn([index, 'value', 'btc'], combinedAssets.getIn([index, 'value', 'btc']).plus(asset.getIn(['value', 'btc'])));
            }, acc.get('assets')));
        }, combined);
      };

      const nahmiiCombined = calcCombinedBalances('baseLayer');
      const nahmiiActive = calcCombinedBalances('baseLayer', 'nahmiiStaged');
      const combined = calcCombinedBalances('nahmiiStaged');

      walletWithInfo = walletWithInfo
        .setIn(['balances', 'nahmiiCombined'], nahmiiCombined)
        .setIn(['balances', 'nahmiiActive'], nahmiiActive)
        .setIn(['balances', 'combined'], combined);

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

const makeSelectTotalBalances = () => createSelector(
  makeSelectWallets(),
  makeSelectBaseLayerBalances(),
  makeSelectNahmiiBalances(),
  makeSelectPrices(),
  makeSelectSupportedAssets(),
  (wallets, baseLayerBalances, nahmiiBalances, prices, supportedAssets) => {
    if (
      supportedAssets.get('loading') ||
      prices.get('loading')
    ) {
      return totalBallAllLoading;
    }

    if (
      supportedAssets.get('error') ||
      prices.get('error')
    ) {
      return totalBalAllError;
    }

    // Caclulate total amount and value of each asset in each type of balance
    let totalBalances = totalBalAllEmpty;
    balanceTypes(baseLayerBalances, nahmiiBalances).forEach(({ label, key, balances }) => {
      balances.keySeq().forEach((address) => {
        // Check address balance is available, and owned by the app user
        const addressBalances = key ? balances.getIn([address, key]) : balances.get(address);
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

          const prevAmount = totalBalances.getIn([label, 'assets', currency, 'amount']) || new BigNumber('0');
          const nextAmount = prevAmount.plus(thisBalance);

          const price = findPriceInfo(prices, balance.get('currency')).get('usd');
          totalBalances = totalBalances.setIn([label, 'assets', currency], fromJS({ amount: nextAmount, value: { usd: nextAmount.times(price) } }));
        });
      });

      // Calculate total USD value for the balance type
      totalBalances.getIn([label, 'assets']).keySeq().forEach((currency) => {
        const amount = totalBalances.getIn([label, 'assets', currency, 'amount']);
        const price = findPriceInfo(prices, currency).get('usd');
        const value = amount.times(price);

        const prevAmount = totalBalances.getIn([label, 'total', 'usd']) || new BigNumber('0');
        totalBalances = totalBalances.setIn([label, 'total', 'usd'], prevAmount.plus(value));
      });
    });

    // calculate combined balances
    const calcCombinedBalances = (assetDetails, asset, label) => {
      const prevAmount = totalBalances.getIn([label, 'assets', asset, 'amount']) || new BigNumber('0');
      const nextAmount = prevAmount.plus(assetDetails.get('amount'));

      const prevValue = totalBalances.getIn([label, 'assets', asset, 'value']) || fromJS({ usd: new BigNumber('0') });
      const nextValue = assetDetails
        .get('value')
        .reduce((acc, value, currency) => acc.set(currency, value.plus(acc.get(currency) || '0')), prevValue);

        // update total values
      const prevTotalValue = totalBalances.getIn([label, 'total']) || new BigNumber('0');
      const nextTotalValue = assetDetails
        .get('value')
        .reduce((acc, value, currency) => acc.set(currency, value.plus(acc.get(currency) || '0')), prevTotalValue);

      totalBalances = totalBalances
        .setIn([label, 'assets', asset, 'value'], nextValue)
        .setIn([label, 'assets', asset, 'amount'], nextAmount)
        .setIn([label, 'total'], nextTotalValue);
    };

    totalBalances.forEach((balance, balanceType) => {
      balance.get('assets').forEach((assetDetails, asset) => {
        calcCombinedBalances(assetDetails, asset, 'combined');
        if (balanceType !== 'baseLayer') {
          calcCombinedBalances(assetDetails, asset, 'nahmiiActive');
          calcCombinedBalances(assetDetails, asset, 'nahmiiCombined');
        }
      });
    });
    return totalBalances;
  }
);

export {
  makeSelectCombinedTransactions,
  makeSelectCurrentWalletWithInfo,
  makeSelectWalletsWithInfo,
  makeSelectTotalBalances,
};

import { createSelector } from 'reselect';
import { referenceCurrencies } from 'utils/wallet';
import { fromJS, List } from 'immutable';
import BigNumber from 'bignumber.js';

/**
 * Direct selector to the walletHoc state domain
 */
const selectWalletHocDomain = (state) => state.get('walletHoc');

/**
 * Other specific selectors
 */

const makeSelectTrezorInfo = () => createSelector(
  selectWalletHocDomain,
  (walletHocDomain) => walletHocDomain.get('trezorInfo')
);

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

const makeSelectTransactions = () => createSelector(
  selectWalletHocDomain,
  (walletHocDomain) => walletHocDomain.get('transactions') || fromJS([])
);

const makeSelectTransactionsWithInfo = () => createSelector(
  makeSelectTransactions(),
  makeSelectSupportedAssets(),
  makeSelectPrices(),
  makeSelectBlockHeight(),
  (transactions, supportedAssets, prices, blockHeight) => {
    // set all address's transactions to loading if don't have all required information
    let transactionsWithInfo = transactions;
    if
    (
      supportedAssets.get('loading') ||
      supportedAssets.get('error') ||
      prices.get('loading') ||
      prices.get('error') ||
      blockHeight.get('loading') ||
      blockHeight.get('error')
    ) {
      transactionsWithInfo = transactionsWithInfo.map((address) => address.set('loading', true));
      return transactionsWithInfo;
    }

    try {
      // for each address iterate over each tx
      transactionsWithInfo = transactionsWithInfo.map((addressObj, address) => {
        const addressTxnsWithInfo = addressObj.get('transactions').reduce((result, tx) => {
          // ignore ETH tx with 0 amount since (to filter contact calls)
          if (tx.get('amount') === '0' && tx.get('currency') === 'ETH') return result;

          // try to locate the asset from supportedAssets
          const assetDetails = supportedAssets
            .get('assets')
            .find((a) => a.get('currency') === tx.get('currency'));

          // ignore unsupported assets
          if (!assetDetails) return result;

          // ignore tx to self
          if (tx.get('sender').toLowerCase() === tx.get('recipient').toLowerCase()) return result;

          let txWithInfo = tx;

          // get tx type
          const type = address.toLowerCase() === tx.get('sender').toLowerCase() ?
                'sent' :
                'received';
          txWithInfo = txWithInfo.set('type', type);

          // get counterpartyAddress
          const counterpartyAddress = type === 'sent' ?
                tx.get('recipient') :
                tx.get('sender');
          txWithInfo = txWithInfo.set('counterpartyAddress', counterpartyAddress);

          // get currency symbol for this tx
          const symbol = assetDetails.get('symbol');
          txWithInfo = txWithInfo.set('symbol', symbol);

          // get decimal amt for this tx
          const decimals = assetDetails.get('decimals');
          const divisionFactor = new BigNumber('10').pow(decimals);
          const weiOrEquivilent = new BigNumber(txWithInfo.get('amount'));
          const decimalAmount = weiOrEquivilent.div(divisionFactor);
          BigNumber.config({ EXPONENTIAL_AT: 20 });
          txWithInfo = txWithInfo.set('decimalAmount', decimalAmount.toString());

          // get fiat value of this tx
          const assetPrices = prices
            .get('assets')
            .find((a) => a.get('currency') === tx.get('currency'));
          const txFiatValue = new BigNumber(txWithInfo.get('decimalAmount')).times(assetPrices.get('usd'));
          txWithInfo = txWithInfo.set('fiatValue', txFiatValue.toString());

          // calculate confirmations
          txWithInfo = txWithInfo
            .set('confirmations', ((blockHeight.get('height') - tx.getIn(['block', 'number'])) + 1).toString());

          return result.push(txWithInfo);
        }, new List());

        return addressObj.set('transactions', addressTxnsWithInfo);
      });
    } catch (error) {
      transactionsWithInfo = fromJS([]);
    }

    return transactionsWithInfo;
  }
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
      prices.get('loading')
    ) {
      return fromJS({ assets: {}, loading: true, error: null, total: { usd: new BigNumber('0') } });
    }

    if (
      supportedAssets.get('error') ||
      prices.get('error')
    ) {
      return fromJS({ assets: {}, loading: false, error: true, total: { usd: new BigNumber('0') } });
    }

    // Caclulate total amount and value of each asset
    let totalBalances = fromJS({ assets: {}, loading: false, total: { usd: new BigNumber('0') } });
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

        const prevAmount = totalBalances.getIn(['assets', currency, 'amount']) || new BigNumber('0');
        const nextAmount = prevAmount.plus(thisBalance);

        const price = prices.get('assets').find((p) => p.get('currency') === balance.get('currency')).get('usd');
        totalBalances = totalBalances.setIn(['assets', currency], fromJS({ amount: nextAmount, value: { usd: nextAmount.times(price) } }));
      });
    });

    // Calculate total USD value
    totalBalances.get('assets').keySeq().forEach((currency) => {
      const amount = totalBalances.getIn(['assets', currency, 'amount']);
      const price = prices.get('assets').find((p) => p.get('currency') === currency).get('usd');
      const value = amount.times(price);

      const prevAmount = totalBalances.getIn(['total', 'usd']) || new BigNumber('0');
      totalBalances = totalBalances.setIn(['total', 'usd'], prevAmount.plus(value));
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
  makeSelectTransactionsWithInfo(),
  (wallets, balances, prices, supportedAssets, transactions) => {
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

      // Check if any critical selectors are in error state
      if (
        supportedAssets.get('error') ||
        prices.get('error') ||
        (balances.get(walletAddress) && balances.getIn([walletAddress, 'error']))
      ) {
        walletBalances = fromJS({ loading: false, error: true, total: { usd: new BigNumber('0'), eth: new BigNumber('0'), btc: new BigNumber('0') } });
      // Check if any critical selectors are loading
      } else if (
        supportedAssets.get('loading') ||
        prices.get('loading') ||
        !balances.get(walletAddress) ||
        balances.getIn([walletAddress, 'loading'])
      ) {
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

const makeSelectBlockHeight = () => createSelector(
  selectWalletHocDomain,
  (walletHocDomain) => walletHocDomain.get('blockHeight')
);

export {
  selectWalletHocDomain,
  makeSelectTrezorInfo,
  makeSelectTotalBalances,
  makeSelectSelectedWalletName,
  makeSelectSupportedAssets,
  makeSelectPrices,
  makeSelectWallets,
  makeSelectTransactions,
  makeSelectTransactionsWithInfo,
  makeSelectDerivationPathInput,
  makeSelectBalances,
  makeSelectLoading,
  makeSelectErrors,
  makeSelectCurrentWallet,
  makeSelectWalletsWithInfo,
  makeSelectCurrentWalletWithInfo,
  makeSelectCurrentDecryptionCallback,
  makeSelectBlockHeight,
};

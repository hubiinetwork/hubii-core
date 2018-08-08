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

const makeSelectTransactions = () => createSelector(
  selectWalletHocDomain,
  (walletHocDomain) => walletHocDomain.get('transactions') || fromJS([])
);

const makeSelectTransactionsWithInfo = () => createSelector(
  makeSelectTransactions(),
  makeSelectSupportedAssets(),
  makeSelectPrices(),
  (transactions, supportedAssets, prices) => {
    // set all address's transactions to loading if don't have all required information
    let transactionsWithInfo = transactions;
    if (supportedAssets.get('loading') || supportedAssets.get('error') || prices.get('loading') || prices.get('error')) {
      transactionsWithInfo = transactionsWithInfo.map((address) => address.set('loading', true));
      return transactionsWithInfo;
    }

    // for each address iterate over each tx
    transactionsWithInfo = transactionsWithInfo.map((addressObj, address) => {
      const txnsWithInfo = addressObj.get('transactions').map((tx) => {
        let txWithInfo = tx;

        // get tx type
        const type = address.toLowerCase() === tx.get('sender') ?
              'sent' :
              'received';
        txWithInfo = txWithInfo.set('type', type);

        // get counterpartyAddress
        const counterpartyAddress = type === 'sent' ?
              tx.get('recipient') :
              tx.get('sender');
        txWithInfo = txWithInfo.set('counterpartyAddress', counterpartyAddress);

        // get currency symbol for this tx
        const assetDetails = supportedAssets
          .get('assets')
          .find((a) => a.get('currency') === tx.get('currency'));

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

        return txWithInfo;
      });

      return addressObj.set('transactions', txnsWithInfo);
    });

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
      prices.get('loading') ||
      supportedAssets.get('error') ||
      prices.get('error')
    ) {
      return fromJS({ assets: {}, loading: true, total: { usd: new BigNumber('0') } });
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
        const decimals = supportedAssets.get('assets').find((asset) => asset.get('currency') === currency).get('decimals');

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
        walletTransactions = fromJS({ loading: true, transactions: [] });
      } else if (transactions.getIn([walletAddress, 'error'])) {
        walletTransactions = fromJS({ loading: false, error: true, transactions: [] });
      } else {
        walletTransactions = fromJS({ loading: false, error: false, transactions: transactions.getIn([walletAddress, 'transactions']) });
      }
      walletWithInfo = walletWithInfo.set('transactions', walletTransactions);

      // Add wallet balances
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
};

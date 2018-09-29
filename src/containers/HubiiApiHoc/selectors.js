import { createSelector } from 'reselect';
import { fromJS, List } from 'immutable';
import BigNumber from 'bignumber.js';

import { makeSelectBlockHeight } from 'containers/EthOperationsHoc/selectors';

/**
 * Direct selector to the hubiiApiHoc state domain
 */
const selectHubiiApiHocDomain = (state) => state.get('hubiiApiHoc');

/**
 * Other selectors
 */
const makeSelectTransactions = () => createSelector(
  selectHubiiApiHocDomain,
  (hubiiApiHocDomain) => hubiiApiHocDomain.get('transactions') || fromJS([])
);

// returns balances state OR a placeholder if the app state is from an old version and needs to reinitialise
const makeSelectBalances = () => createSelector(
  selectHubiiApiHocDomain,
  (hubiiApiHocDomain) => hubiiApiHocDomain.get('balances') || fromJS({})
);

// returns prices state OR a placeholder if the app state is from an old version and needs to reinitialise
const makeSelectPrices = () => createSelector(
  selectHubiiApiHocDomain,
  (hubiiApiHocDomain) => hubiiApiHocDomain.get('prices') || fromJS({ loading: true })
);

// returns supportedAssets state OR a placeholder if the app state is from an old version and needs to reinitialise
const makeSelectSupportedAssets = () => createSelector(
  selectHubiiApiHocDomain,
  (hubiiApiHocDomain) => hubiiApiHocDomain.get('supportedAssets') || fromJS({ loading: true })
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

const makeSelectHubiiWalletAPIToken = () => createSelector(
  selectHubiiApiHocDomain,
  (hubiiApiHocDomain) => hubiiApiHocDomain.get('hubiiWalletApiToken')
);

export {
  makeSelectTransactions,
  makeSelectBalances,
  makeSelectPrices,
  makeSelectSupportedAssets,
  makeSelectTransactionsWithInfo,
  makeSelectHubiiWalletAPIToken,
};

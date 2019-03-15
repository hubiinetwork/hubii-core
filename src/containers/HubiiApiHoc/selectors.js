import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect';
import { fromJS, List } from 'immutable';
import BigNumber from 'bignumber.js';

import { createDeepEqualSelector } from 'utils/selector';

/**
 * Direct selector to the hubiiApiHoc state domain
 */
const selectHubiiApiHocDomain = (state) => state.get('hubiiApiHoc');

export const createTransactionsSelector = createSelectorCreator(
  defaultMemoize,
  (currentArray, previousArray) => {
    let changed = false;
    currentArray.keySeq().forEach((address) => {
      if (!currentArray.getIn([address, 'transactions']) || !previousArray.getIn([address, 'transactions'])) {
        return;
      }
      if (currentArray.getIn([address, 'transactions']).size !== previousArray.getIn([address, 'transactions']).size) {
        changed = true;
      }
    });
    return !changed;
  }
);

const makeSelectTransactions = () => createTransactionsSelector(
  createSelector(
    selectHubiiApiHocDomain,
    (hubiiApiHocDomain) => hubiiApiHocDomain.get('transactions') || fromJS([])
  ),
  (data) => data
);

// returns balances state OR a placeholder if the app state is from an old version and needs to reinitialise
const makeSelectBalances = () => createDeepEqualSelector(
  createSelector(
    selectHubiiApiHocDomain,
    (hubiiApiHocDomain) => hubiiApiHocDomain.get('balances') || fromJS({})
  ),
  (data) => data
);

// returns prices state OR a placeholder if the app state is from an old version and needs to reinitialise
const makeSelectPrices = () => createDeepEqualSelector(
  createSelector(
    selectHubiiApiHocDomain,
    (hubiiApiHocDomain) => hubiiApiHocDomain.get('prices') || fromJS({ loading: true })
  ),
  (data) => data
);

// returns supportedAssets state OR a placeholder if the app state is from an old version and needs to reinitialise
const makeSelectSupportedAssets = () => createDeepEqualSelector(
  createSelector(
    selectHubiiApiHocDomain,
    (hubiiApiHocDomain) => hubiiApiHocDomain.get('supportedAssets') || fromJS({ loading: true })
  ),
  (data) => data
);

const makeSelectTransactionsWithInfo = () => createSelector(
  makeSelectTransactions(),
  makeSelectSupportedAssets(),
  (transactions, supportedAssets) => {
    // set all address's transactions to loading if don't have all required information
    let transactionsWithInfo = transactions;
    if
    (
      supportedAssets.get('loading') ||
      supportedAssets.get('error')
    ) {
      transactionsWithInfo = transactionsWithInfo.map((address) => address.set('loading', true));
      return transactionsWithInfo;
    }

    try {
      // for each address iterate over each tx
      transactionsWithInfo = transactionsWithInfo.map((addressObj, address) => {
        const addressTxnsWithInfo = addressObj.get('transactions').reduce((result, tx) => {
          // ignore ETH tx with 0 amount since (to filter contact calls)
          if (tx.get('amount') === '0' && tx.get('currency') === '0x0000000000000000000000000000000000000000') return result;

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

          // set layer
          txWithInfo = txWithInfo.set('layer', 'baseLayer');

          // set timestamp
          txWithInfo = txWithInfo.set(
            'timestamp',
            txWithInfo.getIn(['block', 'timestamp'])
          );

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

export {
  makeSelectTransactions,
  makeSelectBalances,
  makeSelectPrices,
  makeSelectSupportedAssets,
  makeSelectTransactionsWithInfo,
};

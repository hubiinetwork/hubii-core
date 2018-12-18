import { createSelector } from 'reselect';
import { fromJS } from 'immutable';

/**
 * Selectors adding nahmii state to other sources
 */

import {
  makeSelectTransactionsWithInfo,
} from 'containers/HubiiApiHoc/selectors';
import {
  makeSelectReceiptsWithInfo,
} from './selectors';

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

export {
  makeSelectCombinedTransactions,
};

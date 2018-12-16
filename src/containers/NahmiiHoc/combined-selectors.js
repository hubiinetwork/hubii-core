// import { createSelector } from 'reselect';
// import { fromJS } from 'immutable';
// import BigNumber from 'bignumber.js';

// /**
//  * Selectors adding nahmii state to other sources
//  */

// import {
//   makeSelectTransactionsWithInfo,
// } from 'containers/HubiiApiHoc/selectors';
// import {
//   makeSelectReceiptsWithInfo,
// } from './selectors';

// // given that the two arrays are already sorted we can use a greedy
// // approach to go through each array and track the smallest element,
// // each time adding it to a new merged array.
// // O(n) time & O(n) space
// // https://wsvincent.com/javascript-merge-two-sorted-arrays/
// const mergeTransactions = (baseLayer, nahmii) => {
//   const merged = [];
//   let index1 = 0;
//   let index2 = 0;
//   let current = 0;

//   while (current < (baseLayer.length + nahmii.length)) {
//     const unmerged1 = baseLayer[index1];
//     const unmerged2 = nahmii[index2];

//     // if next comes from arr1
//     if (unmerged1 < unmerged2) {
//       merged[current] = unmerged1;
//       index1 += 1;

//     // if next comes from arr2
//     } else {
//       merged[current] = unmerged2;
//       index2 += 1;
//     }

//     current += 1;
//   }

//   return merged;
// };

// const makeSelectCombinedTransactions = () => createSelector(
//   makeSelectTransactionsWithInfo(),
//   makeSelectReceiptsWithInfo(),
//   (baseLayerTransactions, nahmiiReceipts) => {
//     const combinedTransactions = baseLayerTransactions.map((transactions, address) => {
//       const baseLayer = transactions.get('transactions').toJS();
//       const nahmii = nahmiiReceipts.getIn([address, 'receipts']).toJS();
//       console.log(baseLayer);
//       console.log(nahmii);
//     });

//     return baseLayerTransactions;
//   }
// );

// export {
//   makeSelectCombinedTransactions,
// };

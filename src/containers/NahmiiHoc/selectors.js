import { createSelector } from 'reselect';
import { fromJS } from 'immutable';


/**
 * Direct selector to the nahmiiHoc state domain
 */
const selectNahmiiHocDomain = (state) => state.get('nahmiiHoc');

const makeSelectReceipts = () => createSelector(
    selectNahmiiHocDomain,
  (nahmiiHocDomain) => nahmiiHocDomain.get('receipts') || fromJS({})
);

const makeSelectReceiptsByAddress = (address) => createSelector(
  makeSelectReceipts(),
  (receipts) => receipts.get(address) || fromJS([])
);

export {
  makeSelectReceipts,
  makeSelectReceiptsByAddress,
};

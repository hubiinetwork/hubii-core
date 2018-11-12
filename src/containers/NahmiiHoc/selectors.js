import { createSelector } from 'reselect';
import { fromJS } from 'immutable';
import {makeSelectCurrentWallet} from 'containers/WalletHoc/selectors'

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
  (receipts) => {
    return receipts.get(address) || fromJS([])
  }
);

const makeSelectNahmiiWallets = () => createSelector(
  selectNahmiiHocDomain,
  (nahmiiHocDomain) => nahmiiHocDomain.get('wallets') || fromJS({})
);

const makeSelectLastPaymentChallenge = () => createSelector(
  makeSelectNahmiiWallets(),
  makeSelectCurrentWallet(),
  (nahmiiWallets, currentWallet) => {
    const address = currentWallet.get('address')
    const nahmiiWallet = nahmiiWallets.get(address)
    if (!nahmiiWallet) {
      return null
    }
    return nahmiiWallet.get('lastPaymentChallenge') || fromJS({})
  }
);

const makeSelectLastSettlePaymentDriip = () => createSelector(
  makeSelectNahmiiWallets(),
  makeSelectCurrentWallet(),
  (nahmiiWallets, currentWallet) => {
    const address = currentWallet.get('address')
    const nahmiiWallet = nahmiiWallets.get(address)
    if (!nahmiiWallet) {
      return null
    }
    return nahmiiWallet.get('lastSettlePaymentDriip') || fromJS({})
  }
);

export {
  makeSelectReceipts,
  makeSelectReceiptsByAddress,
  makeSelectLastPaymentChallenge,
  makeSelectLastSettlePaymentDriip,
};

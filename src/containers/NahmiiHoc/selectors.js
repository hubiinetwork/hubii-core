import { createSelector } from 'reselect';
import { fromJS } from 'immutable';
import { makeSelectCurrentNetwork } from 'containers/App/selectors';
import { makeSelectCurrentWallet } from 'containers/WalletHoc/selectors';

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

const makeSelectNahmiiWallets = () => createSelector(
  selectNahmiiHocDomain,
  (nahmiiHocDomain) => nahmiiHocDomain.get('wallets') || fromJS({})
);

const makeSelectNahmiiBalances = () => createSelector(
  selectNahmiiHocDomain,
  (nahmiiHocDomain) => nahmiiHocDomain.get('balances') || fromJS({})
);

const makeSelectNahmiiSettlementTransactions = () => createSelector(
  selectNahmiiHocDomain,
  (nahmiiHocDomain) => nahmiiHocDomain.get('transactions') || fromJS({})
);

const makeSelectLastPaymentChallenge = () => createSelector(
  makeSelectNahmiiWallets(),
  makeSelectCurrentWallet(),
  (nahmiiWallets, currentWallet) => {
    const address = currentWallet.get('address');
    const nahmiiWallet = nahmiiWallets.get(address);
    if (!nahmiiWallet) {
      return fromJS({});
    }
    return nahmiiWallet.get('lastPaymentChallenge') || fromJS({});
  }
);

const makeSelectLastPaymentChallengeByAddress = (address) => createSelector(
  makeSelectNahmiiWallets(),
  (nahmiiWallets) => {
    const nahmiiWallet = nahmiiWallets.get(address);
    if (!nahmiiWallet) {
      return fromJS({});
    }
    return nahmiiWallet.get('lastPaymentChallenge') || fromJS({});
  }
);

const makeSelectLastSettlePaymentDriip = () => createSelector(
  makeSelectNahmiiWallets(),
  makeSelectCurrentWallet(),
  (nahmiiWallets, currentWallet) => {
    const address = currentWallet.get('address');
    const nahmiiWallet = nahmiiWallets.get(address);
    if (!nahmiiWallet) {
      return fromJS({});
    }
    return nahmiiWallet.get('lastSettlePaymentDriip') || fromJS({});
  }
);

const makeSelectNahmiiBalancesByCurrentWallet = () => createSelector(
  makeSelectNahmiiBalances(),
  makeSelectCurrentWallet(),
  (nahmiiBalances, currentWallet) => {
    const address = currentWallet.get('address');
    const nahmiiBalance = nahmiiBalances.get(address);
    return nahmiiBalance || fromJS({});
  }
);

const makeSelectNahmiiSettlementTransactionsByCurrentWallet = () => createSelector(
  makeSelectNahmiiSettlementTransactions(),
  makeSelectCurrentWallet(),
  makeSelectCurrentNetwork(),
  (nahmiiSettlementTransactions, currentWallet, network) => {
    const address = currentWallet.get('address');
    const txs = nahmiiSettlementTransactions.get(address);
    const txsByCurrency = {};
    if (txs) {
      const _txs = txs.toJS();
      Object.keys(_txs).forEach((currency) => {
        txsByCurrency[currency] = [];
        Object.keys(_txs[currency]).forEach((hash) => {
          txsByCurrency[currency].push(_txs[currency][hash]);
        });
        txsByCurrency[currency]
          .filter((a) => a.network === network.provider.name)
          .sort((a, b) => b.createdAt - a.createdAt);
      });
    }
    return txsByCurrency;
  }
);

export {
  makeSelectReceipts,
  makeSelectReceiptsByAddress,
  makeSelectLastPaymentChallenge,
  makeSelectLastPaymentChallengeByAddress,
  makeSelectLastSettlePaymentDriip,
  makeSelectNahmiiBalances,
  makeSelectNahmiiBalancesByCurrentWallet,
  makeSelectNahmiiSettlementTransactionsByCurrentWallet,
};

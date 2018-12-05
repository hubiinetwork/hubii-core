import { createSelector } from 'reselect';
import { fromJS } from 'immutable';
import BigNumber from 'bignumber.js';
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
          .filter((a) => a.network === network.provider.network.name)
          .sort((a, b) => b.createdAt - a.createdAt);
      });
    }
    return txsByCurrency;
  }
);

const makeSelectNahmiiBalances = () => createSelector(
  selectNahmiiHocDomain,
  (nahmiiHocDomain) => {
    const balances = nahmiiHocDomain.get('balances') || fromJS({});

    // create a 'total' balance entry for each address
    let balancesWithTotal = balances;
    balances.forEach((address, i) => {
      let total = fromJS({
        loading: false,
        error: false,
        assets: [],
      });
      total = address.toSetSeq().reduce((acc, cur) => {
        // if any are loading/erroed for this address set it's 'total' to loading/errored and 'assets' to none
        if (acc.get('loading') || acc.get('error')) return acc;
        if (cur.get('loading')) {
          return acc
            .set('loading', true)
            .set('assets', fromJS([]));
        }
        if (cur.get('error')) {
          return acc
            .set('error', 'someerror')
            .set('assets', fromJS([]));
        }

        let assets = acc.get('assets');
        for (let j = 0; j < cur.get('assets').size; j += 1) {
          const assetIndex = assets.findIndex((asset) => asset.get('currency') === cur.getIn(['assets', j, 'currency']));
          // asset not yet in total, add it
          if (assetIndex === -1) {
            assets = assets.push(cur.getIn(['assets', j]));
          } else {
            // asset in total, add to the balance
            assets = assets.setIn(
            [assetIndex, 'balance'],
            new BigNumber(assets.getIn([assetIndex, 'balance'])).plus(cur.getIn(['assets', j, 'balance'])).toString());
          }
        }
        return acc.set('assets', assets);
      }, total);
      balancesWithTotal = balancesWithTotal.setIn([i, 'total'], total);
    });
    return balancesWithTotal;
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

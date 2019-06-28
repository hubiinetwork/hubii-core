import nahmii from 'nahmii-sdk';
import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect';
import { fromJS, List } from 'immutable';
import BigNumber from 'bignumber.js';
import { makeSelectCurrentNetwork } from 'containers/App/selectors';
import {
  makeSelectCurrentWallet,
} from 'containers/WalletHoc/selectors';

import {
  makeSelectSupportedAssets,
} from 'containers/HubiiApiHoc/selectors';

import { createDeepEqualSelector } from 'utils/selector';

/**
 * Direct selector to the nahmiiHoc state domain
 */
const selectNahmiiHocDomain = (state) => state.get('nahmiiHoc');

export const createReceiptsSelector = createSelectorCreator(
  defaultMemoize,
  (previousArray, currentArray) => {
    let changed = false;
    currentArray.keySeq().forEach((address) => {
      const previousReceipts = previousArray.getIn([address, 'receipts']);
      const currentReceipts = currentArray.getIn([address, 'receipts']);

      if (!currentReceipts && !previousReceipts) {
        return;
      }

      if (
        (!previousReceipts && currentReceipts) ||
        (previousReceipts.size !== currentReceipts.size)
      ) {
        changed = true;
      }
    });
    return !changed;
  }
);

const makeSelectReceipts = () => createReceiptsSelector(
  createSelector(
    selectNahmiiHocDomain,
    (nahmiiHocDomain) => nahmiiHocDomain.get('receipts')
  ),
  (data) => data
);

const makeSelectReceiptsWithInfo = () => createSelector(
  makeSelectReceipts(),
  makeSelectSupportedAssets(),
  (receipts, supportedAssets) => {
    // set all address's receipts to loading if don't have all required information
    let receiptsWithInfo = receipts;
    if
    (
      supportedAssets.get('loading') ||
      supportedAssets.get('error')
    ) {
      receiptsWithInfo = receipts
        .map((address) => address
          .set('loading', true)
          .set('receipts', fromJS([])));
      return receiptsWithInfo;
    }

    receiptsWithInfo = receipts.map((addressObj, address) => {
      const addressReceiptsWithInfo = addressObj.get('receipts').reduce((result, receipt) => {
        let receiptWithInfo = receipt;
        receiptWithInfo = receiptWithInfo.set('currency', receiptWithInfo.getIn(['currency', 'ct']));

        // try to locate the asset from supportedAssets
        const assetDetails = supportedAssets
          .get('assets')
          .find((a) => a.get('currency') === receiptWithInfo.get('currency'));

        // ignore unsupported assets
        if (!assetDetails) return result;

        // get receipt type
        const type = address.toLowerCase() === receipt.getIn(['sender', 'wallet']).toLowerCase() ?
                'sent' :
                'received';
        receiptWithInfo = receiptWithInfo.set('type', type);

        // get counterpartyAddress
        const counterpartyAddress = type === 'sent' ?
                receipt.getIn(['recipient', 'wallet']) :
                receipt.getIn(['sender', 'wallet']);
        receiptWithInfo = receiptWithInfo.set('counterpartyAddress', counterpartyAddress);

        // get currency symbol for this receipt
        const symbol = assetDetails.get('symbol');
        receiptWithInfo = receiptWithInfo.set('symbol', symbol);

        // get decimal amt for this receipt
        const decimals = assetDetails.get('decimals');
        const divisionFactor = new BigNumber('10').pow(decimals);
        const weiOrEquivilent = new BigNumber(receiptWithInfo.get('amount'));
        const decimalAmount = weiOrEquivilent.div(divisionFactor);
        BigNumber.config({ EXPONENTIAL_AT: 20 });
        receiptWithInfo = receiptWithInfo.set('decimalAmount', decimalAmount.toString());

        // set 'confirmed' to true. when we add data from the payments endpoint, set the
        // conf status of those receipt to false.
        receiptWithInfo = receiptWithInfo.set('confirmed', true);

        // set blockNumber to a number instead of string
        receiptWithInfo = receiptWithInfo
          .set('blockNumber', parseInt(receiptWithInfo.get('blockNumber'), 10));

        // set layer
        receiptWithInfo = receiptWithInfo.set('layer', 'nahmii');

        // set timestamp
        receiptWithInfo = receiptWithInfo.set(
          'timestamp',
          receiptWithInfo.get('updated')
        );

        return result.push(receiptWithInfo);
      }, new List());

      return addressObj.set('receipts', addressReceiptsWithInfo);
    });

    return receiptsWithInfo;
  }
);

const makeSelectReceiptsByAddress = (address) => createSelector(
  makeSelectReceipts(),
  (receipts) => receipts.get(address) || fromJS([])
);

const makeSelectNahmiiWallets = () => createSelector(
  selectNahmiiHocDomain,
  (nahmiiHocDomain) => nahmiiHocDomain.get('wallets') || fromJS({})
);

const makeSelectWalletCurrency = () => createSelector(
  selectNahmiiHocDomain,
  (nahmiiHocDomain) => nahmiiHocDomain.get('selectedCurrency')
);

const makeSelectOngoingChallenges = () => createSelector(
  selectNahmiiHocDomain,
  (nahmiiHocDomain) => nahmiiHocDomain.get('ongoingChallenges') || fromJS({})
);

const makeSelectSettleableChallenges = () => createSelector(
  selectNahmiiHocDomain,
  (nahmiiHocDomain) => nahmiiHocDomain.get('settleableChallenges') || fromJS({})
);

const makeSelectNewSettlementPendingTxs = () => createSelector(
  selectNahmiiHocDomain,
  (nahmiiHocDomain) => nahmiiHocDomain.get('newSettlementPendingTxs')
);

const makeSelectNewSettlementPendingTxsList = () => createSelector(
  makeSelectNewSettlementPendingTxs(),
  (newSettlementPendingTxs) => {
    const pendingTxs = [];
    if (!newSettlementPendingTxs) {
      return pendingTxs;
    }
    const newSettlementPendingTxsJSON = newSettlementPendingTxs.toJS();
    Object.keys(newSettlementPendingTxsJSON).forEach((address) => {
      Object.keys(newSettlementPendingTxsJSON[address]).forEach((currency) => {
        Object.keys(newSettlementPendingTxsJSON[address][currency]).forEach((txHash) => {
          const pendingTx = newSettlementPendingTxsJSON[address][currency][txHash];
          pendingTxs.push({ address, currency, tx: pendingTx });
        });
      });
    });
    return pendingTxs;
  }
);

const makeSelectHasSettlementPendingTxsByWalletCurrency = (address, currency) => createSelector(
  makeSelectNewSettlementPendingTxsList(),
  (pendingTxs) => {
    const matches = pendingTxs.filter((pendingTx) =>
      nahmii.utils.caseInsensitiveCompare(pendingTx.address, address) &&
      nahmii.utils.caseInsensitiveCompare(pendingTx.currency, currency)
    );
    return matches.length > 0;
  }
);

const makeSelectWithdrawals = () => createSelector(
  selectNahmiiHocDomain,
  (nahmiiHocDomain) => nahmiiHocDomain.get('withdrawals') || fromJS({})
);

const makeSelectNahmiiSettlementTransactions = () => createSelector(
  selectNahmiiHocDomain,
  (nahmiiHocDomain) => nahmiiHocDomain.get('transactions') || fromJS({})
);

const makeSelectOngoingChallengesForCurrentWalletCurrency = () => createSelector(
  makeSelectOngoingChallenges(),
  makeSelectCurrentWallet(),
  makeSelectWalletCurrency(),
  (ongoingChallenges, currentWallet, selectedCurrency) => {
    const address = currentWallet.get('address');
    let challenges = ongoingChallenges.getIn([address, selectedCurrency]) || fromJS({});
    if (!challenges.get('details')) {
      challenges = challenges.set('details', []);
    }
    return challenges;
  }
);

const makeSelectSettleableChallengesForCurrentWalletCurrency = () => createSelector(
  makeSelectSettleableChallenges(),
  makeSelectCurrentWallet(),
  makeSelectWalletCurrency(),
  (settleableChallenges, currentWallet, selectedCurrency) => {
    const address = currentWallet.get('address');
    let challenges = settleableChallenges.getIn([address, selectedCurrency]) || fromJS({});
    if (!challenges.get('details')) {
      challenges = challenges.set('details', []);
    }
    if (!challenges.get('invalidReasons')) {
      challenges = challenges.set('invalidReasons', []);
    }
    return challenges;
  }
);

const makeSelectWithdrawalsForCurrentWalletCurrency = () => createSelector(
  makeSelectWithdrawals(),
  makeSelectCurrentWallet(),
  makeSelectWalletCurrency(),
  (withdrawals, currentWallet, selectedCurrency) => {
    const address = currentWallet.get('address');
    let withdrawlsObj = withdrawals.getIn([address, selectedCurrency]) || fromJS({});
    if (!withdrawlsObj.get('details')) {
      withdrawlsObj = withdrawlsObj.set('details', []);
    }
    return withdrawlsObj;
  }
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

const makeSelectDepositStatus = () => createSelector(
  selectNahmiiHocDomain,
  (nahmiiHocDomain) => nahmiiHocDomain.get('depositStatus')
);

const makeSelectRawNahmiiBalances = () => createDeepEqualSelector(
  createSelector(
    selectNahmiiHocDomain,
    (nahmiiHocDomain) => nahmiiHocDomain.get('balances') || fromJS({})
  ),
  (data) => data
);

const makeSelectNahmiiBalances = () => createDeepEqualSelector(
  makeSelectRawNahmiiBalances(),
  (balances) => {
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
  makeSelectWalletCurrency,
  makeSelectReceipts,
  makeSelectReceiptsByAddress,
  makeSelectLastPaymentChallenge,
  makeSelectLastPaymentChallengeByAddress,
  makeSelectLastSettlePaymentDriip,
  makeSelectNahmiiBalances,
  makeSelectNahmiiBalancesByCurrentWallet,
  makeSelectNahmiiSettlementTransactionsByCurrentWallet,
  makeSelectReceiptsWithInfo,
  makeSelectDepositStatus,
  makeSelectOngoingChallenges,
  makeSelectOngoingChallengesForCurrentWalletCurrency,
  makeSelectSettleableChallengesForCurrentWalletCurrency,
  makeSelectWithdrawalsForCurrentWalletCurrency,
  makeSelectNewSettlementPendingTxs,
  makeSelectNewSettlementPendingTxsList,
  makeSelectHasSettlementPendingTxsByWalletCurrency,
};

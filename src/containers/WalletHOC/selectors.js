import { createSelector } from 'reselect';
import { referenceCurrencies, IsAddressMatch } from 'utils/wallet';
import { fromJS } from 'immutable';

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

const makeSelectBalances = () => createSelector(
  selectWalletHocDomain,
  (walletHocDomain) => walletHocDomain.get('balances')
);

const makeSelectPrices = () => createSelector(
  selectWalletHocDomain,
  (walletHocDomain) => walletHocDomain.get('prices')
);

const makeSelectSupportedTokens = () => createSelector(
  selectWalletHocDomain,
  (walletHocDomain) => walletHocDomain.get('supportedTokens')
);

const makeSelectWalletsWithInfo = () => createSelector(
  makeSelectWallets(),
  makeSelectBalances(),
  makeSelectPrices(),
  makeSelectSupportedTokens(),
  (wallets, balances, prices, supportedTokens) => {
    const walletsWithInfo = wallets.map((wallet) => {
      let walletWithInfo = wallet;

      // Add balance info for each token
      let walletBalances = balances.get(wallet.get('address'));
      if (!walletBalances) {
        walletBalances = [];
      } else if (walletBalances.get('loading')) {
        walletBalances = walletBalances.set('loading', true);
      } else {
        walletBalances = walletBalances.set('assets', walletBalances.get('assets').map((token) => {
          let walletToken = token;
          const supportedTokenIndex = supportedTokens
          .get('tokens')
          .findIndex((t) => t.get('currency') === token.get('currency'));

          const priceIndex = prices
          .get('tokens')
          .findIndex((t) => t.get('currency') === token.get('currency'));

          // Currently ETH supported info not returned, mock it
          const supportedTokenInfo =
          supportedTokenIndex !== -1
            ? supportedTokens.getIn(['tokens', supportedTokenIndex])
            : fromJS({ symbol: 'ETH', decimals: 18, color: 'grey' });

          // Currently ETH price info not returned, mock it
          const priceInfo =
          priceIndex !== -1
            ? prices.getIn(['tokens', priceIndex])
            : fromJS({ eth: 1, btc: 0.01, usd: 412 });

          // Remove redundant value
          walletToken = walletToken.delete('address');

          // Get real balance
          const realBalance = walletToken.get('balance') / (10 ** supportedTokenInfo.get('decimals'));
          walletToken = walletToken.set('balance', realBalance);

          // Add symbol for each token
          const symbol = supportedTokenInfo.get('symbol');
          walletToken = walletToken.set('symbol', symbol);

          // Add reference currency values for each token
          referenceCurrencies.forEach((currency) => {
            walletToken = walletToken
            .setIn(['value', currency], priceInfo.get(currency) * walletToken.get('balance'));
          });

          return walletToken;
        }));

        // Add total balance info for each wallet
        referenceCurrencies.forEach((currency) => {
          walletBalances = walletBalances
          .setIn(['total', currency], walletBalances.get('assets').reduce((acc, token) => acc + token.getIn(['value', currency]), 0));
        });
      }

      walletWithInfo = walletWithInfo.set('balances', walletBalances);
      return walletWithInfo;
    });

    return walletsWithInfo;
  }
);

const makeSelectCurrentWalletDetails = () => createSelector(
  makeSelectWallets(),
  makeSelectCurrentWallet(),
  (wallets, currentWallet) => {
    const currentWalletIndex = wallets.findIndex((w) => w.get('address') === currentWallet.get('address'));
    if (currentWalletIndex === -1) return {};

    const walletDetails = wallets.get(currentWalletIndex);
    return walletDetails;
  }
);

const makeSelectPendingTransactions = () => createSelector(
  selectWalletHocDomain,
  (walletHocDomain) => walletHocDomain.get('pendingTransactions')
);

const makeSelectConfirmedTransactions = () => createSelector(
  selectWalletHocDomain,
  (walletHocDomain) => walletHocDomain.get('confirmedTransactions')
);

const makeSelectAllTransactions = () => createSelector(
  makeSelectCurrentWalletDetails(),
  makeSelectPendingTransactions(),
  makeSelectConfirmedTransactions(),
  (currentWalletDetails, pendingTxns, confirmedTxns) => {
    const txns = [].concat(pendingTxns.toJS()).concat(confirmedTxns.toJS());
    return txns.filter((txn) => {
      const address = currentWalletDetails.address;
      return IsAddressMatch(txn.from, address) || IsAddressMatch(txn.to, address);
    }).sort((a, b) => b.timestamp - a.timestamp);
  }
);

export {
  selectWalletHocDomain,
  makeSelectLedgerNanoSInfo,
  makeSelectNewWalletNameInput,
  makeSelectPasswordInput,
  makeSelectSelectedWalletName,
  makeSelectWallets,
  makeSelectDerivationPathInput,
  makeSelectLoading,
  makeSelectErrors,
  makeSelectCurrentWallet,
  makeSelectWalletsWithInfo,
  makeSelectCurrentWalletDetails,
  makeSelectAllTransactions,
};

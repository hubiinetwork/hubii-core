import { createSelector } from 'reselect';
import { convertWalletsList, IsAddressMatch } from 'utils/wallet';

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

const makeSelectWalletList = () => createSelector(
  makeSelectWallets(),
  makeSelectBalances(),
  makeSelectPrices(),
  makeSelectSupportedTokens(),
  (wallets, balances, prices, supportedTokens) => {
    const walletList = convertWalletsList(wallets);
    return walletList.map((wallet) => {
      let walletBalances = balances.getIn([wallet.address]);
      if (!walletBalances) {
        return { ...wallet, balances: { tokens: [] } };
      }
      if (!walletBalances.tokens) {
        return { ...wallet, balances: walletBalances };
      }
      walletBalances = walletBalances.tokens.map((balance) => {
        const pri = prices.find((price) => price.currency === balance.currency);
        const tkn = supportedTokens.find((token) => token.currency === balance.currency);
        return {
          symbol: tkn.symbol,
          balance: balance.balance,
          decimals: tkn.decimals,
          price: {
            usd: pri.usd,
            eth: pri.eth,
            btc: pri.btc,
          },
          color: tkn.color,
        };
      });
      return { ...wallet, balances: walletBalances };
    });
  }
);

const makeSelectCurrentWalletDetails = () => createSelector(
  makeSelectWalletList(),
  makeSelectCurrentWallet(),
  (walletList, currentWallet) => {
    const walletDetails = walletList.find((wallet) => wallet.address === currentWallet.get('address'));
    return walletDetails || {};
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
  makeSelectWalletList,
  makeSelectCurrentWalletDetails,
  makeSelectAllTransactions,
};

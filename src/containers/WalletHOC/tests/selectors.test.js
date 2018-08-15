import { fromJS } from 'immutable';

import {
  selectWalletHocDomain,
  makeSelectSelectedWalletName,
  makeSelectWallets,
  makeSelectDerivationPathInput,
  makeSelectLoading,
  makeSelectErrors,
  makeSelectCurrentWalletWithInfo,
  makeSelectWalletsWithInfo,
  makeSelectSupportedAssets,
  makeSelectPrices,
  makeSelectBalances,
  makeSelectTotalBalances,
  makeSelectTransactions,
  makeSelectTransactionsWithInfo,
} from '../selectors';

import {
  balancesMock,
  walletsWithInfoMock,
  transactionsMock,
  transactionsWithInfoMock,
  supportedAssetsLoadedMock,
  supportedAssetsLoadingMock,
  supportedAssetsErrorMock,
  pricesLoadedMock,
  pricesLoadingMock,
  pricesErrorMock,
  blockHeightErrorMock,
  blockHeightLoadingMock,
  totalBalancesLoadedMock,
  totalBalancesLoadingMock,
  walletHocMock,
  currentWalletMock,
  totalBalancesErrorMock,
} from './mocks/selectors';

describe('selectWalletHocDomain', () => {
  it('should select the walletHocDomain state', () => {
    const walletHocState = fromJS({
      test: 1223,
    });
    const mockedState = fromJS({
      walletHoc: walletHocState,
    });
    expect(selectWalletHocDomain(mockedState)).toEqual(walletHocState);
  });
});

describe('makeSelectDerivationPathInput', () => {
  const derivationPathInputSelector = makeSelectDerivationPathInput();
  it('should correctly select derivationPath', () => {
    const derivationPath = 'm/0/0/11';
    const mockedState = fromJS({
      walletHoc: {
        inputs: {
          derivationPath,
        },
      },
    });
    expect(derivationPathInputSelector(mockedState)).toEqual(derivationPath);
  });
});

describe('makeSelectSelectedWalletName', () => {
  const selectedWalletNameSelector = makeSelectSelectedWalletName();
  it('should correctly select selectedWalletName', () => {
    const selectedWalletName = 'cheese_toasty';
    const mockedState = fromJS({
      walletHoc: {
        selectedWalletName,
      },
    });
    expect(selectedWalletNameSelector(mockedState)).toEqual(selectedWalletName);
  });
});

describe('makeSelectWallets', () => {
  const walletsSelector = makeSelectWallets();
  it('should correctly select wallets', () => {
    const wallets = fromJS({ software: { pineapple: { key: '123' } } });
    const mockedState = fromJS({
      walletHoc: {
        wallets,
      },
    });
    expect(walletsSelector(mockedState)).toEqual(wallets);
  });
});

describe('makeSelectLoading', () => {
  const loadingSelector = makeSelectLoading();
  it('should correctly select loading state', () => {
    const loading = fromJS({ creatingWallet: true });
    const mockedState = fromJS({
      walletHoc: {
        loading,
      },
    });
    expect(loadingSelector(mockedState)).toEqual(loading);
  });
});

describe('makeSelectErrors', () => {
  const errorsSelector = makeSelectErrors();
  it('should correctly select errors state', () => {
    const errors = fromJS({ creatingWalletError: true });
    const mockedState = fromJS({
      walletHoc: {
        errors,
      },
    });
    expect(errorsSelector(mockedState)).toEqual(errors);
  });
});

describe('makeSelectSupportedAssets', () => {
  const supportedAssetsSelector = makeSelectSupportedAssets();
  it('should correctly select supportedAssets state', () => {
    const expected = supportedAssetsLoadedMock;
    const mockedState = fromJS({
      walletHoc: walletHocMock,
    });
    // console.log(walletHocMock);
    expect(supportedAssetsSelector(mockedState)).toEqual(expected);
  });
});

describe('makeSelectPrices', () => {
  const pricesSelector = makeSelectPrices();
  it('should correctly select prices state', () => {
    const expected = pricesLoadedMock;
    const mockedState = fromJS({
      walletHoc: walletHocMock,
    });
    expect(pricesSelector(mockedState)).toEqual(expected);
  });
});

describe('makeSelectBalances', () => {
  const balancesSelector = makeSelectBalances();
  it('should correctly select balances state', () => {
    const mockedState = fromJS({
      walletHoc: {
        balances: balancesMock,
      },
    });
    expect(balancesSelector(mockedState)).toEqual(balancesMock);
  });
});

describe('makeSelectTransactions', () => {
  const transactionsSelector = makeSelectTransactions();
  it('should correctly select transactions state', () => {
    const mockedState = fromJS({
      walletHoc: {
        transactions: transactionsMock,
      },
    });
    expect(transactionsSelector(mockedState)).toEqual(transactionsMock);
  });
});

describe('makeSelectTotalBalances', () => {
  const totalBalancesSelector = makeSelectTotalBalances();
  it('should correctly combine balances, prices and supportedAssets state', () => {
    const mockedState = fromJS({
      walletHoc: walletHocMock,
    });
    const expected = totalBalancesLoadedMock;
    expect(totalBalancesSelector(mockedState)).toEqual(expected);
  });

  it('should correctly return loading object if supportedAssets is loading', () => {
    const mockedState = fromJS({
      walletHoc: walletHocMock.set('supportedAssets', supportedAssetsLoadingMock),
    });
    const expected = totalBalancesLoadingMock;
    expect(totalBalancesSelector(mockedState)).toEqual(expected);
  });

  it('should correctly return loading object if prices is loading', () => {
    const mockedState = fromJS({
      walletHoc: walletHocMock.set('prices', pricesLoadingMock),
    });
    const expected = totalBalancesLoadingMock;
    expect(totalBalancesSelector(mockedState)).toEqual(expected);
  });

  it('should correctly return error object if supportedAssets is errored', () => {
    const mockedState = fromJS({
      walletHoc: walletHocMock.set('supportedAssets', supportedAssetsErrorMock),
    });
    const expected = totalBalancesErrorMock;
    expect(totalBalancesSelector(mockedState)).toEqual(expected);
  });

  it('should correctly return error object if prices is errored', () => {
    const mockedState = fromJS({
      walletHoc: walletHocMock.set('prices', pricesErrorMock),
    });
    const expected = totalBalancesErrorMock;
    expect(totalBalancesSelector(mockedState)).toEqual(expected);
  });
});

describe('makeSelectCurrentWalletWithInfo', () => {
  const currentWalletWithInfoSelector = makeSelectCurrentWalletWithInfo();
  it('should return the wallet from walletsWithInfo if exists', () => {
    const mockedState = fromJS({
      walletHoc: walletHocMock,
    });
    const expected = walletsWithInfoMock.get(0);
    expect(currentWalletWithInfoSelector(mockedState)).toEqual(expected);
  });

  it('should return empty {} if wallet doesn\t exist', () => {
    const mockedState = fromJS({
      walletHoc: walletHocMock.setIn(['currentWallet', 'address'], 'doesn\'t exist'),
    });
    const expected = fromJS({});
    expect(currentWalletWithInfoSelector(mockedState)).toEqual(expected);
  });
});

describe('makeSelectTransactionsWithInfo', () => {
  const transactionsWithInfoSelector = makeSelectTransactionsWithInfo();
  it('should add type, counterpartyAddress, symbol, decimal amt, fait value to all transactions', () => {
    const expected = transactionsWithInfoMock;
    const mockedState = fromJS({
      walletHoc: walletHocMock,
    });
    expect(transactionsWithInfoSelector(mockedState)).toEqual(expected);
  });

  it('should mark add tx as loading when supportedAssets loading', () => {
    const mockedState = fromJS({
      walletHoc: walletHocMock.set('supportedAssets', supportedAssetsLoadingMock),
    });
    const expected = transactionsMock.map((a) => a.set('loading', true));
    expect(transactionsWithInfoSelector(mockedState)).toEqual(expected);
  });

  it('should mark add tx as loading when supportedAssets errored', () => {
    const mockedState = fromJS({
      walletHoc: walletHocMock.set('supportedAssets', supportedAssetsErrorMock),
    });
    const expected = transactionsMock.map((a) => a.set('loading', true));
    expect(transactionsWithInfoSelector(mockedState)).toEqual(expected);
  });

  it('should mark add tx as loading when prices loading', () => {
    const mockedState = fromJS({
      walletHoc: walletHocMock.set('prices', pricesLoadingMock),
    });
    const expected = transactionsMock.map((a) => a.set('loading', true));
    expect(transactionsWithInfoSelector(mockedState)).toEqual(expected);
  });

  it('should mark add tx as loading when prices errored', () => {
    const mockedState = fromJS({
      walletHoc: walletHocMock.set('prices', pricesErrorMock),
    });
    const expected = transactionsMock.map((a) => a.set('loading', true));
    expect(transactionsWithInfoSelector(mockedState)).toEqual(expected);
  });

  it('should mark add tx as loading when blockHeight loading', () => {
    const mockedState = fromJS({
      walletHoc: walletHocMock.set('blockHeight', blockHeightLoadingMock),
    });
    const expected = transactionsMock.map((a) => a.set('loading', true));
    expect(transactionsWithInfoSelector(mockedState)).toEqual(expected);
  });

  it('should mark add tx as loading when blockHeight errored', () => {
    const mockedState = fromJS({
      walletHoc: walletHocMock.set('blockHeight', blockHeightErrorMock),
    });
    const expected = transactionsMock.map((a) => a.set('loading', true));
    expect(transactionsWithInfoSelector(mockedState)).toEqual(expected);
  });
});

describe('makeSelectWalletsWithInfo', () => {
  const walletsWithInfoSelector = makeSelectWalletsWithInfo();
  it('should piece together balances and txns for the wallet', () => {
    const expected = walletsWithInfoMock;
    const mockedState = fromJS({
      walletHoc: walletHocMock,
    });
    expect(walletsWithInfoSelector(mockedState)).toEqual(expected);
  });

  it('should set wallets tx to loading if it doesnt exist yet in tx state', () => {
    const mockedState = fromJS({
      walletHoc: walletHocMock.deleteIn(['transactions', currentWalletMock.get('address')]),
    });
    const walletsWithInfo = walletsWithInfoSelector(mockedState);
    const wallet = walletsWithInfo.find((w) => w.get('address') === currentWalletMock.get('address'));
    expect(wallet.getIn(['transactions', 'loading'])).toEqual(true);
  });

  it('should set wallets tx to loading if it\'s tx are in loading state', () => {
    const mockedState = fromJS({
      walletHoc: walletHocMock.setIn(['transactions', currentWalletMock.get('address'), 'loading'], true),
    });
    const walletsWithInfo = walletsWithInfoSelector(mockedState);
    const wallet = walletsWithInfo.find((w) => w.get('address') === currentWalletMock.get('address'));
    expect(wallet.getIn(['transactions', 'loading'])).toEqual(true);
  });

  it('should set wallets tx to error if it\'s tx are in error state and its not already in loading state', () => {
    const mockedState = fromJS({
      walletHoc: walletHocMock
        .setIn(['transactions', currentWalletMock.get('address'), 'error'], true)
        .setIn(['transactions', currentWalletMock.get('address'), 'loading'], false),
    });
    const walletsWithInfo = walletsWithInfoSelector(mockedState);
    const wallet = walletsWithInfo.find((w) => w.get('address') === currentWalletMock.get('address'));
    expect(wallet.getIn(['transactions', 'error'])).toEqual(true);
  });

  it('should set wallets balances to loading if supportedAssets is loading and its balance isnt errored', () => {
    const mockedState = fromJS({
      walletHoc: walletHocMock.set('supportedAssets', supportedAssetsLoadingMock),
    });
    const walletsWithInfo = walletsWithInfoSelector(mockedState);
    walletsWithInfo.forEach((w) => {
      if (!w.getIn(['balances', 'error'])) {
        expect(w.getIn(['balances', 'loading'])).toEqual(true);
      }
    });
  });

  it('should set wallets balances to loading if supportedAssets is loading and its balance isnt errored', () => {
    const mockedState = fromJS({
      walletHoc: walletHocMock.set('prices', pricesLoadingMock),
    });
    const walletsWithInfo = walletsWithInfoSelector(mockedState);
    walletsWithInfo.forEach((w) => {
      if (!w.getIn(['balances', 'error'])) {
        expect(w.getIn(['balances', 'loading'])).toEqual(true);
      }
    });
  });

  it('should set a wallet\'s balance to loading if it doesn\'t exist in balances', () => {
    const mockedState = fromJS({
      walletHoc: walletHocMock.setIn(['balances', currentWalletMock.get('address')], null),
    });
    const walletsWithInfo = walletsWithInfoSelector(mockedState);
    const wallet = walletsWithInfo.find((w) => w.get('address') === currentWalletMock.get('address'));
    expect(wallet.getIn(['balances', 'loading'])).toEqual(true);
  });

  it('should set a wallet\'s balance to loading if it\'s balance state is loadng', () => {
    const mockedState = fromJS({
      walletHoc: walletHocMock
        .setIn(['balances', currentWalletMock.get('address'), 'loading'], true)
        .setIn(['balances', currentWalletMock.get('address'), 'error'], false),
    });
    const walletsWithInfo = walletsWithInfoSelector(mockedState);
    const wallet = walletsWithInfo.find((w) => w.get('address') === currentWalletMock.get('address'));
    expect(wallet.getIn(['balances', 'loading'])).toEqual(true);
  });

  it('should set all walletBalances to errored if supportedAssets is errored', () => {
    const mockedState = fromJS({
      walletHoc: walletHocMock.set('supportedAssets', supportedAssetsErrorMock),
    });
    const walletsWithInfo = walletsWithInfoSelector(mockedState);
    walletsWithInfo.forEach((w) => {
      expect(w.getIn(['balances', 'error'])).toEqual(true);
    });
  });

  it('should set all walletBalances to errored if prices is errored', () => {
    const mockedState = fromJS({
      walletHoc: walletHocMock.set('prices', pricesErrorMock),
    });
    const walletsWithInfo = walletsWithInfoSelector(mockedState);
    walletsWithInfo.forEach((w) => {
      expect(w.getIn(['balances', 'error'])).toEqual(true);
    });
  });

  it('should set a wallet\'s balance to error if it\'s balance state is errored', () => {
    const mockedState = fromJS({
      walletHoc: walletHocMock
        .setIn(['balances', currentWalletMock.get('address'), 'error'], true),
    });
    const walletsWithInfo = walletsWithInfoSelector(mockedState);
    const wallet = walletsWithInfo.find((w) => w.get('address') === currentWalletMock.get('address'));
    expect(wallet.getIn(['balances', 'error'])).toEqual(true);
  });
});

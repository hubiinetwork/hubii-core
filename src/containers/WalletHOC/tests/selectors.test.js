import { fromJS } from 'immutable';
import BigNumber from 'bignumber.js';

import {
  selectWalletHocDomain,
  makeSelectNewWalletNameInput,
  makeSelectPasswordInput,
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
} from '../selectors';
import { walletsMock, balancesMock, supportedAssetsMock, walletsWithInfoMock, pricesMock, currentWalletMock, address1Mock, totalBalancesMock } from './mocks';

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

describe('makeSelectNewWalletNameInput', () => {
  const newWalletNameInputSelector = makeSelectNewWalletNameInput();
  it('should correctly select newWalletName', () => {
    const newWalletName = 'burgers';
    const mockedState = fromJS({
      walletHoc: {
        inputs: {
          newWalletName,
        },
      },
    });
    expect(newWalletNameInputSelector(mockedState)).toEqual(newWalletName);
  });
});

describe('makeSelectPasswordInput', () => {
  const passwordInputSelector = makeSelectPasswordInput();
  it('should correctly select password', () => {
    const password = 'roast_beef';
    const mockedState = fromJS({
      walletHoc: {
        inputs: {
          password,
        },
      },
    });
    expect(passwordInputSelector(mockedState)).toEqual(password);
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
    const mockedState = fromJS({
      walletHoc: {
        supportedAssets: supportedAssetsMock,
      },
    });
    expect(supportedAssetsSelector(mockedState)).toEqual(supportedAssetsMock);
  });
});

describe('makeSelectPrices', () => {
  const pricesSelector = makeSelectPrices();
  it('should correctly select prices state', () => {
    const mockedState = fromJS({
      walletHoc: {
        prices: pricesMock,
      },
    });
    expect(pricesSelector(mockedState)).toEqual(pricesMock);
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

describe('makeSelectTotalBalances', () => {
  const totalBalancesSelector = makeSelectTotalBalances();
  it('should correctly combine balances, prices and supportedAssets state', () => {
    const mockedState = fromJS({
      walletHoc: {
        balances: balancesMock,
        wallets: walletsMock,
        prices: pricesMock,
        supportedAssets: supportedAssetsMock,
      },
    });
    const expected = totalBalancesMock;
    expect(totalBalancesSelector(mockedState)).toEqual(expected);
  });

  it('should correctly return loading object if supportedAssets is loading', () => {
    const mockedState = fromJS({
      walletHoc: {
        balances: balancesMock,
        prices: pricesMock,
        supportedAssets: supportedAssetsMock.set('loading', true),
      },
    });
    const expected = fromJS({ assets: {}, loading: true, totalUsd: new BigNumber('0') });
    expect(totalBalancesSelector(mockedState)).toEqual(expected);
  });

  it('should correctly return loading object if prices is loading', () => {
    const mockedState = fromJS({
      walletHoc: {
        balances: balancesMock,
        prices: pricesMock.set('loading', true),
        supportedAssets: supportedAssetsMock,
      },
    });
    const expected = fromJS({ assets: {}, loading: true, totalUsd: new BigNumber('0') });
    expect(totalBalancesSelector(mockedState)).toEqual(expected);
  });
});

describe('makeSelectCurrentWalletWithInfo', () => {
  const currentWalletWithInfoSelector = makeSelectCurrentWalletWithInfo();
  it('should return the wallet from walletsWithInfo if exists', () => {
    const mockedState = fromJS({
      walletHoc: {
        wallets: walletsMock,
        currentWallet: currentWalletMock,
        supportedAssets: supportedAssetsMock,
        balances: balancesMock,
        prices: pricesMock,
      },
    });
    const expected = walletsWithInfoMock.get(0);
    expect(currentWalletWithInfoSelector(mockedState)).toEqual(expected);
  });

  it('should return empty {} if wallet doesn\t exist', () => {
    const mockedState = fromJS({
      walletHoc: {
        wallets: walletsMock,
        currentWallet: fromJS({ address: 'doesn\'t exisit!' }),
        supportedAssets: supportedAssetsMock,
        balances: balancesMock,
        prices: pricesMock,
      },
    });
    const expected = fromJS({});
    expect(currentWalletWithInfoSelector(mockedState)).toEqual(expected);
  });
});

describe('makeSelectWalletsWithInfo', () => {
  const walletsWithInfoSelector = makeSelectWalletsWithInfo();
  it('should piece together balances/token to the wallet', () => {
    const expected = walletsWithInfoMock;
    const mockedState = fromJS({
      walletHoc: {
        wallets: walletsMock,
        balances: balancesMock,
        supportedAssets: supportedAssetsMock,
        prices: pricesMock,
      },
    });
    expect(walletsWithInfoSelector(mockedState)).toEqual(expected);
  });

  it('should mark walletsWithInfo as loading when supportedAssets loading', () => {
    const mockedState = fromJS({
      walletHoc: {
        wallets: walletsMock,
        balances: balancesMock,
        supportedAssets: supportedAssetsMock.set('loading', true),
        prices: pricesMock,
      },
    });
    const expected = walletsMock.map((w) => w.set('balances', fromJS({ loading: true, total: { usd: new BigNumber('0'), eth: new BigNumber('0'), btc: new BigNumber('0') } })));
    expect(walletsWithInfoSelector(mockedState)).toEqual(expected);
  });

  it('should mark walletsWithInfo as loading when prices loading', () => {
    const mockedState = fromJS({
      walletHoc: {
        wallets: walletsMock,
        balances: balancesMock,
        supportedAssets: supportedAssetsMock,
        prices: pricesMock.set('loading', true),
      },
    });
    const expected = walletsMock.map((w) => w.set('balances', fromJS({ loading: true, total: { usd: new BigNumber('0'), eth: new BigNumber('0'), btc: new BigNumber('0') } })));
    expect(walletsWithInfoSelector(mockedState)).toEqual(expected);
  });

  it('should mark walletsWithInfo as errored when prices has errored', () => {
    const mockedState = fromJS({
      walletHoc: {
        wallets: walletsMock,
        balances: balancesMock,
        supportedAssets: supportedAssetsMock,
        prices: pricesMock.set('error', true),
      },
    });
    const expected = walletsMock.map((w) => w.set('balances', fromJS({ loading: false, error: true, total: { usd: new BigNumber('0'), eth: new BigNumber('0'), btc: new BigNumber('0') } })));
    expect(walletsWithInfoSelector(mockedState)).toEqual(expected);
  });

  it('should mark walletsWithInfo as errored when supportedAssets has errored', () => {
    const mockedState = fromJS({
      walletHoc: {
        wallets: walletsMock,
        balances: balancesMock,
        supportedAssets: supportedAssetsMock.set('error', true),
        prices: pricesMock,
      },
    });
    const expected = walletsMock.map((w) => w.set('balances', fromJS({ loading: false, error: true, total: { usd: new BigNumber('0'), eth: new BigNumber('0'), btc: new BigNumber('0') } })));
    expect(walletsWithInfoSelector(mockedState)).toEqual(expected);
  });

  it('should mark a single wallet as loading if only its balance is loading', () => {
    const mockedState = fromJS({
      walletHoc: {
        wallets: walletsMock,
        balances: balancesMock.setIn(['assets', address1Mock, 'loading'], true),
        supportedAssets: supportedAssetsMock,
        prices: pricesMock,
      },
    });
    const expected = walletsWithInfoMock.set(address1Mock, fromJS({ loading: true, total: { usd: 0, eth: 0, btc: 0 } })).get(0);
    expect(walletsWithInfoSelector(mockedState).get(0)).toEqual(expected);
  });

  it('should mark a single wallet as errored if only its balance is erroed', () => {
    const mockedState = fromJS({
      walletHoc: {
        wallets: walletsMock,
        balances: balancesMock.setIn(['assets', address1Mock, 'error'], true),
        supportedAssets: supportedAssetsMock,
        prices: pricesMock,
      },
    });
    const expected = walletsWithInfoMock.set(address1Mock, fromJS({ loading: false, error: true, total: { usd: 0, eth: 0, btc: 0 } })).get(0);
    expect(walletsWithInfoSelector(mockedState).get(0)).toEqual(expected);
  });
});

import { fromJS } from 'immutable';

import { storeMock } from 'mocks/store';
import { referenceCurrencies } from 'utils/wallet';

import {
  supportedAssetsLoadingMock,
  supportedAssetsErrorMock,
  pricesLoadingMock,
  pricesErrorMock,
} from 'containers/HubiiApiHoc/tests/mocks/selectors';

import {
  makeSelectCurrentWalletWithInfo,
  makeSelectWalletsWithInfo,
  makeSelectTotalBalances,
} from 'containers/NahmiiHoc/combined-selectors';

import {
  selectWalletHocDomain,
  makeSelectSelectedWalletName,
  makeSelectWallets,
  makeSelectExecutableWallets,
  makeSelectDerivationPathInput,
  makeSelectLoading,
  makeSelectErrors,
} from '../selectors';

import {
  walletsWithInfoMock,
  currentWalletSoftwareMock,
  totalBalancesLoadedMock,
  totalBalancesErrorMock,
  totalBalancesLoadingMock,
} from './mocks/selectors';

describe('selectWalletHocDomain', () => {
  it('should select the walletHocDomain state', () => {
    const walletHocState = fromJS({ test: 1223 });
    const mockedState = storeMock
      .set('walletHoc', walletHocState);
    expect(selectWalletHocDomain(mockedState)).toEqual(walletHocState);
  });
});

describe('makeSelectDerivationPathInput', () => {
  const derivationPathInputSelector = makeSelectDerivationPathInput();
  it('should correctly select derivationPath', () => {
    const derivationPath = 'm/0/0/11';
    const mockedState = storeMock
      .setIn(['walletHoc', 'inputs', 'derivationPath'], derivationPath);
    expect(derivationPathInputSelector(mockedState)).toEqual(derivationPath);
  });
});

describe('makeSelectSelectedWalletName', () => {
  const selectedWalletNameSelector = makeSelectSelectedWalletName();
  it('should correctly select selectedWalletName', () => {
    const selectedWalletName = 'cheese_toasty';
    const mockedState = storeMock
      .setIn(['walletHoc', 'selectedWalletName'], selectedWalletName);
    expect(selectedWalletNameSelector(mockedState)).toEqual(selectedWalletName);
  });
});

describe('makeSelectWallets', () => {
  const walletsSelector = makeSelectWallets();
  it('should correctly select wallets', () => {
    const wallets = fromJS([
      { type: 'software', name: 'w1', address: '0x1', encrypted: {}, decrypted: {} },
      { type: 'lns', name: 'w2', address: '0x2' },
      { type: 'trezor', name: 'w3', address: '0x3' },
      { type: 'watch', name: 'w4', address: '0x4' },
    ]);
    const mockedState = storeMock
      .setIn(['walletHoc', 'wallets'], wallets);
    expect(walletsSelector(mockedState)).toEqual(wallets);
  });
});

describe('makeSelectExecutableWallets', () => {
  const walletsSelector = makeSelectExecutableWallets();
  it('should correctly select wallets', () => {
    const wallets = fromJS([
      { type: 'software', name: 'w1', address: '0x1', encrypted: {}, decrypted: {} },
      { type: 'lns', name: 'w2', address: '0x2' },
      { type: 'trezor', name: 'w3', address: '0x3' },
    ]);
    const mockedState = storeMock
      .setIn(['walletHoc', 'wallets'], wallets.push(fromJS({ type: 'watch', name: 'w4', address: '0x4' })));
    expect(walletsSelector(mockedState)).toEqual(wallets);
  });
});

describe('makeSelectLoading', () => {
  const loadingSelector = makeSelectLoading();
  it('should correctly select loading state', () => {
    const loading = fromJS({ creatingWallet: true });
    const mockedState = storeMock
      .setIn(['walletHoc', 'loading'], loading);
    expect(loadingSelector(mockedState)).toEqual(loading);
  });
});

describe('makeSelectErrors', () => {
  const errorsSelector = makeSelectErrors();
  it('should correctly select errors state', () => {
    const errors = fromJS({ creatingWalletError: true });
    const mockedState = storeMock
      .setIn(['walletHoc', 'errors'], errors);
    expect(errorsSelector(mockedState)).toEqual(errors);
  });
});


describe('makeSelectCurrentWalletWithInfo', () => {
  const currentWalletWithInfoSelector = makeSelectCurrentWalletWithInfo();
  it('should return the wallet from walletsWithInfo if exists', () => {
    const expected = walletsWithInfoMock.get(0);
    expect(currentWalletWithInfoSelector(storeMock)).toEqual(expected);
  });

  it('should return empty {} if wallet doesn\t exist', () => {
    const mockedState = storeMock
      .setIn(['walletHoc', 'currentWallet', 'address'], 'doesn\'t exist');
    const expected = fromJS({});
    expect(currentWalletWithInfoSelector(mockedState)).toEqual(expected);
  });
});

describe('makeSelectWalletsWithInfo', () => {
  let walletsWithInfoSelector;
  beforeEach(() => {
    walletsWithInfoSelector = makeSelectWalletsWithInfo();
  });
  it('should piece together balances and txns for the wallet', () => {
    const expected = walletsWithInfoMock;
    expect(walletsWithInfoSelector(storeMock)).toEqual(expected);
  });

  it('should set wallets balances to loading if supportedAssets is loading and its balance isnt errored', () => {
    const mockedState = storeMock
      .setIn(['hubiiApiHoc', 'supportedAssets'], supportedAssetsLoadingMock);
    const walletsWithInfo = walletsWithInfoSelector(mockedState);
    walletsWithInfo.forEach((w) => {
      if (!w.getIn(['balances', 'baseLayer', 'error'])) {
        expect(w.getIn(['balances', 'baseLayer', 'loading'])).toEqual(true);
      }
    });
  });

  it('should set wallets balances to loading if supportedAssets is loading and its balance isnt errored', () => {
    const mockedState = storeMock
      .setIn(['hubiiApiHoc', 'prices'], pricesLoadingMock);
    const walletsWithInfo = walletsWithInfoSelector(mockedState);
    walletsWithInfo.forEach((w) => {
      if (!w.getIn(['balances', 'baseLayer', 'error'])) {
        expect(w.getIn(['balances', 'baseLayer', 'loading'])).toEqual(true);
      }
    });
  });

  it('should set a wallet\'s balance to loading if it doesn\'t exist in balances', () => {
    const mockedState = storeMock
      .setIn(['hubiiApiHoc', 'balances', currentWalletSoftwareMock.get('address')], null);
    const walletsWithInfo = walletsWithInfoSelector(mockedState);
    const wallet = walletsWithInfo.find((w) => w.get('address') === currentWalletSoftwareMock.get('address'));
    expect(wallet.getIn(['balances', 'baseLayer', 'loading'])).toEqual(true);
  });

  it('should set a wallet\'s balance to loading if it\'s balance state is loadng', () => {
    const mockedState = storeMock
      .setIn(['hubiiApiHoc', 'balances', currentWalletSoftwareMock.get('address'), 'loading'], true)
      .setIn(['hubiiApiHoc', 'balances', currentWalletSoftwareMock.get('address'), 'error'], false);
    const walletsWithInfo = walletsWithInfoSelector(mockedState);
    const wallet = walletsWithInfo.find((w) => w.get('address') === currentWalletSoftwareMock.get('address'));
    expect(wallet.getIn(['balances', 'baseLayer', 'loading'])).toEqual(true);
  });

  it('should set all walletBalances to errored if supportedAssets is errored', () => {
    const mockedState = storeMock
      .setIn(['hubiiApiHoc', 'supportedAssets'], supportedAssetsErrorMock);
    const walletsWithInfo = walletsWithInfoSelector(mockedState);
    walletsWithInfo.forEach((w) => {
      expect(w.getIn(['balances', 'baseLayer', 'error'])).toEqual(true);
    });
  });

  it('should set all walletBalances to errored if prices is errored', () => {
    const mockedState = storeMock
      .setIn(['hubiiApiHoc', 'prices'], pricesErrorMock);
    const walletsWithInfo = walletsWithInfoSelector(mockedState);
    walletsWithInfo.forEach((w) => {
      expect(w.getIn(['balances', 'baseLayer', 'error'])).toEqual(true);
    });
  });

  it('should set a wallet\'s balance to error if it\'s balance state is errored', () => {
    const mockedState = storeMock
      .setIn(['hubiiApiHoc', 'balances', currentWalletSoftwareMock.get('address'), 'error'], true);
    const walletsWithInfo = walletsWithInfoSelector(mockedState);
    const wallet = walletsWithInfo.find((w) => w.get('address') === currentWalletSoftwareMock.get('address'));
    expect(wallet.getIn(['balances', 'baseLayer', 'error'])).toEqual(true);
  });

  it('should set values to 0 if there are no prices for the currencies', () => {
    const mockedState = storeMock
      .deleteIn(['hubiiApiHoc', 'transactions', currentWalletSoftwareMock.get('address')])
      .setIn(['hubiiApiHoc', 'prices', 'assets'], fromJS([]));

    const walletsWithInfo = walletsWithInfoSelector(mockedState);
    const wallet = walletsWithInfo.find((w) => w.get('address') === currentWalletSoftwareMock.get('address'));
    wallet.get('balances').valueSeq().forEach((balance) => {
      referenceCurrencies.forEach((currency) => {
        expect(balance.getIn(['total', currency]).toString()).toEqual('0');
      });
    });
  });
});

describe('makeSelectTotalBalances', () => {
  const totalBalancesSelector = makeSelectTotalBalances();
  it('should correctly combine balances, prices and supportedAssets state', () => {
    const expected = totalBalancesLoadedMock;
    expect(totalBalancesSelector(storeMock)).toEqual(expected);
  });

  it('should correctly return loading object if supportedAssets is loading', () => {
    const mockedState = storeMock
      .setIn(['hubiiApiHoc', 'supportedAssets'], supportedAssetsLoadingMock);
    const expected = totalBalancesLoadingMock;
    expect(totalBalancesSelector(mockedState)).toEqual(expected);
  });

  it('should correctly return loading object if prices is loading', () => {
    const mockedState = storeMock
      .setIn(['hubiiApiHoc', 'prices'], pricesLoadingMock);
    const expected = totalBalancesLoadingMock;
    expect(totalBalancesSelector(mockedState)).toEqual(expected);
  });

  it('should correctly return error object if supportedAssets is errored', () => {
    const mockedState = storeMock
      .setIn(['hubiiApiHoc', 'supportedAssets'], supportedAssetsErrorMock);
    const expected = totalBalancesErrorMock;
    expect(totalBalancesSelector(mockedState)).toEqual(expected);
  });

  it('should correctly return error object if prices is errored', () => {
    const mockedState = storeMock
      .setIn(['hubiiApiHoc', 'prices'], pricesErrorMock);
    const expected = totalBalancesErrorMock;
    expect(totalBalancesSelector(mockedState)).toEqual(expected);
  });

  it('should set values to 0 if there are no prices for the currencies', () => {
    const mockedState = storeMock
      .deleteIn(['hubiiApiHoc', 'transactions', currentWalletSoftwareMock.get('address')])
      .setIn(['hubiiApiHoc', 'prices', 'assets'], fromJS([]));

    const result = totalBalancesSelector(mockedState);
    result.valueSeq().forEach((balance) => {
      expect(balance.getIn(['total', 'usd']).toString()).toEqual('0');
    });
  });
});

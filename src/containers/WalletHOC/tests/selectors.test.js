import { fromJS } from 'immutable';

import {
  selectWalletHocDomain,
  makeSelectNewWalletNameInput,
  makeSelectPasswordInput,
  makeSelectSelectedWalletName,
  makeSelectWallets,
  makeSelectDerivationPathInput,
  makeSelectLoading,
  makeSelectErrors,
  makeSelectCurrentWalletDetails,
  makeSelectWalletsWithInfo,
} from '../selectors';
import { walletsMock, balancesMock, supportedAssetsLoadedMock, walletsWithInfoMock, pricesLoadedMock, address1Mock } from './mocks';

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

describe('makeSelectCurrentWalletDetails', () => {
  const walletSelector = makeSelectCurrentWalletDetails();
  it('should convert select current wallet details from the wallet list', () => {
    const expected = fromJS({
      address: '0x2',
      name: 't2',
      type: 'software',
      encrypted: '{"address": "2"}',
    });
    const mockedState = fromJS({
      walletHoc: {
        wallets: [
          { name: 't1', type: 'software', encrypted: '{"address": "1"}' },
          { address: '0x2', name: 't2', type: 'software', encrypted: '{"address": "2"}' },
        ],
        currentWallet: {
          name: 't2',
          address: '0x2',
        },
      },
    });
    expect(walletSelector(mockedState)).toEqual(expected);
  });
});

describe('makeSelectWalletsWithInfo', () => {
  const walletsWithInfoSelector = makeSelectWalletsWithInfo();
  it('should piece together balances/token to the wallet', () => {
    const wallets = walletsMock;
    const balances = balancesMock;
    const supportedAssets = supportedAssetsLoadedMock;
    const expected = walletsWithInfoMock;
    const prices = pricesLoadedMock;
    const mockedState = fromJS({
      walletHoc: {
        wallets,
        balances,
        supportedAssets,
        prices,
      },
    });
    expect(walletsWithInfoSelector(mockedState)).toEqual(expected);
  });

  it('should mark balances as loading when loading', () => {
    const wallets = walletsMock;
    const balances = balancesMock.setIn([address1Mock, 'loading'], true);
    const supportedAssets = supportedAssetsLoadedMock;
    const prices = pricesLoadedMock;
    const expected = true;
    const mockedState = fromJS({
      walletHoc: {
        wallets,
        balances,
        supportedAssets,
        prices,
      },
    });
    expect(walletsWithInfoSelector(mockedState).getIn([0, 'balances', 'loading'])).toEqual(expected);
  });

  it('should set balances to [] if they don\'t exist', () => {
    const wallets = walletsMock;
    const balances = balancesMock.delete(address1Mock);
    const supportedAssets = supportedAssetsLoadedMock;
    const prices = pricesLoadedMock;
    const expected = [];
    const mockedState = fromJS({
      walletHoc: {
        wallets,
        balances,
        supportedAssets,
        prices,
      },
    });
    expect(walletsWithInfoSelector(mockedState).getIn([0, 'balances'])).toEqual(expected);
  });
});

import { fromJS } from 'immutable';
import {
  selectWalletManagerDomain,
  makeSelectNewWalletNameInput,
  makeSelectPasswordInput,
  makeSelectSelectedWalletName,
  makeSelectWallets,
  makeSelectDerivationPathInput,
} from '../selectors';

describe('selectWalletManagerDomain', () => {
  it('should select the walletManagerDomain state', () => {
    const walletManagerState = fromJS({
      test: 1223,
    });
    const mockedState = fromJS({
      walletManager: walletManagerState,
    });
    expect(selectWalletManagerDomain(mockedState)).toEqual(walletManagerState);
  });
});

describe('makeSelectNewWalletNameInput', () => {
  const newWalletNameInputSelector = makeSelectNewWalletNameInput();
  it('should correctly select newWalletName', () => {
    const newWalletName = 'burgers';
    const mockedState = fromJS({
      walletManager: {
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
      walletManager: {
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
      walletManager: {
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
      walletManager: {
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
      walletManager: {
        wallets,
      },
    });
    expect(walletsSelector(mockedState)).toEqual(wallets);
  });
});

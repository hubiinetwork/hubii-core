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
  makeSelectWalletList,
} from '../selectors';

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
    const expected = {
      address: '0x2',
      encrypted: { address: '2' },
      name: 't2',
      type: 'software',
    };
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

describe('makeSelectWalletList', () => {
  it.only('should piece together balances/token to the wallet', () => {
    const walletList = makeSelectWalletList();
    const address = '0x2';
    const balances = [
      {
        address,
        currency: 'ETH',
        balance: '179312830516700000',
      },
      {
        address,
        currency: '0x583cbbb8a8443b38abcc0c956bece47340ea1367',
        balance: '6100000000000000',
      },
    ];
    const prices = [
      {
        currency: 'ETH',
        eth: 1,
        btc: 1,
        usd: 1,
      },
      {
        currency: '0x583cbbb8a8443b38abcc0c956bece47340ea1367',
        eth: 2,
        btc: 2,
        usd: 2,
      },
    ];
    const tokens = [
      { currency: '0x8899544F1fc4E0D570f3c998cC7e5857140dC322',
        symbol: 'My20',
        decimals: 18,
        color: 'FFAA00' },
      { currency: '0x583cbbb8a8443b38abcc0c956bece47340ea1367',
        symbol: 'HBT',
        decimals: 15,
        color: '0063A5' },
    ];
    const clonedBalances = balances.slice(0).map((balance) => {
      const pri = prices.find((price) => price.currency === balance.currency);
      const tkn = tokens.find((token) => token.currency === balance.currency);
      return {
        symbol: tkn.symbol,
        balance: balance.balance,
        decimals: tkn.decimals,
        price: {
          usd: pri.usd,
          eth: pri.eth,
          btc: pri.btc,
        },
        primaryColor: tkn.color,
      };
    });
    const expected = [{
      address,
      encrypted: { address: '2' },
      name: 't2',
      type: 'software',
      balances: clonedBalances,
    }];
    const mockedState = fromJS({
      walletHoc: {
        wallets: [
          { name: 't1', type: 'software', encrypted: '{"address": "1"}' },
          { address, name: 't2', type: 'software', encrypted: '{"address": "2"}' },
        ],
        balances: {
          [address]: {
            tokens: balances,
          },
        },
        supportedTokens: {
          tokens,
        },
        prices: {
          tokens: prices,
        },
      },
    });
    expect(walletList(mockedState)).toEqual(expected);
  });
  it('should mark balance loading when the balance for a wallet address is in loading', () => {

  });
  it('should mark balance error when there are errors when loading a balance', () => {

  });
});

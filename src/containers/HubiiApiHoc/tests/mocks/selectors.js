import { fromJS } from 'immutable';

import {
  loadedWalletTransactions,
  loadingWalletTransactions,
  errorWalletTransactions,
} from './index';

// makeSelectTransactions
export const transactionsEmptyMock = fromJS({});

export const transactionsMock = fromJS({
  ...loadedWalletTransactions.toJS(),
  ...loadingWalletTransactions.toJS(),
  ...errorWalletTransactions.toJS(),
  '0x2ba8dc656a85d6d36f93c5e2e17ca910efa5faeb': {
    loading: true,
    error: null,
    transactions: [],
  },
});

// makeSelectTransactionsWithInfo
export const transactionsWithInfoEmptyMock = transactionsEmptyMock;

export const transactionsWithInfoMock = transactionsMock.setIn(
  ['0x1c7429f62595097315289ceBaC1fDbdA587Ad512', 'transactions'],
  fromJS([
    {
      decimalAmount: '0.0000000001',
      counterpartyAddress: '0x910c4ba923b2243dc13e00a066eefb8ffd905eb0',
      block: { number: 3780091, timestamp: '2018-08-06T02:32:00.000Z' },
      hash:
        '0x84db5d53f1b5e82bdae027408989cf5451191d76b8b021710cfa0d95bbd5d34c',
      currency: 'ETH',
      sender: '0x910c4ba923b2243dc13e00a066eefb8ffd905eb0',
      amount: '100000000',
      symbol: 'ETH',
      recipient: '0x1c7429f62595097315289ceBaC1fDbdA587Ad512',
      type: 'received',
      fiatValue: '0.0000000412',
      confirmations: '3',
    },
    {
      decimalAmount: '0.000000000000000005',
      counterpartyAddress: '0x910c4ba923b2243dc13e00a066eefb8ffd905eb0',
      block: {
        number: 3780091,
        timestamp: '2018-08-06T02:32:00.000Z',
      },
      hash:
        '0x84db5d53f1b5e82bdae027408989cf5451191d76b8b021710cfa0d95bbd5d34c',
      currency: '0x583cbbb8a8443b38abcc0c956bece47340ea1367',
      sender: '0x1c7429f62595097315289ceBaC1fDbdA587Ad512',
      amount: '5',
      symbol: 'BOKKY',
      recipient: '0x910c4ba923b2243dc13e00a066eefb8ffd905eb0',
      type: 'sent',
      fiatValue: '0.000000000000000005',
      confirmations: '3',
    },
  ])
);

// makeSelectBalancesMock
export const balancesEmptyMock = fromJS({});

export const balancesMock = fromJS({
  '0x1c7429f62595097315289ceBaC1fDbdA587Ad512': {
    loading: false,
    error: null,
    assets: [
      {
        address: '0x1c7429f62595097315289ceBaC1fDbdA587Ad512',
        currency: 'ETH',
        balance: '198937000000000000',
      },
      {
        address: '0x1c7429f62595097315289ceBaC1fDbdA587Ad512',
        currency: '0x583cbbb8a8443b38abcc0c956bece47340ea1367',
        balance: '1231288',
      },
    ],
  },
  '0x2ba8dc656a85d6d36f93c5e2e17ca910efa5faeb': {
    loading: true,
    error: null,
    assets: [],
  },
  '0xF4db7c6030c9c5754A6A712212d6342DCA52e25d': {
    loading: true,
    error: null,
    assets: [],
  },
  '0x82191e2863E0b6AFC0A7D538cdabfd509aA648b5': {
    loading: false,
    error: true,
    assets: [],
  },
});

// makeSelectPrices
export const pricesLoadedMock = fromJS({
  loading: false,
  error: null,
  assets: [
    {
      currency: '0x8899544F1fc4E0D570f3c998cC7e5857140dC322',
      eth: 0,
      btc: 0,
      usd: 0,
      timestamp: '2018-07-25T01:33:34.908Z',
    },
    {
      currency: '0x8d1b4bc5664436d64cca2fd4c8b39ae71cb2662a',
      eth: 0,
      btc: 0,
      usd: 0,
      timestamp: '2018-07-25T01:33:34.908Z',
    },
    {
      currency: '0xcda3f98783d8ee980ee21f548bfe42965d13d64d',
      eth: 0,
      btc: 0,
      usd: 0,
      timestamp: '2018-07-25T01:33:34.908Z',
    },
    {
      currency: '0xc00fd9820cd2898cc4c054b7bf142de637ad129a',
      eth: 0,
      btc: 0,
      usd: 0,
      timestamp: '2018-07-25T01:33:34.908Z',
    },
    {
      currency: '0x583cbbb8a8443b38abcc0c956bece47340ea1367',
      eth: 0.1,
      btc: 0.001,
      usd: 1,
      timestamp: '2018-07-25T01:33:34.908Z',
    },
    {
      currency: 'ETH',
      eth: 1,
      btc: 0.01,
      usd: 412,
    },
  ],
});

export const pricesLoadingMock = fromJS({
  loading: true,
  error: null,
  assets: [],
});

export const pricesErrorMock = fromJS({
  loading: false,
  error: true,
  assets: [],
});

// makeSelectSupportedAssets
export const supportedAssetsLoadedMock = fromJS({
  loading: false,
  error: null,
  assets: [
    {
      currency: '0x8899544F1fc4E0D570f3c998cC7e5857140dC322',
      symbol: 'My20',
      decimals: 18,
      color: 'FFAA00',
    },
    {
      currency: '0x8d1b4bc5664436d64cca2fd4c8b39ae71cb2662a',
      symbol: 'HBT',
      decimals: 15,
      color: '0063A5',
    },
    {
      currency: '0xcda3f98783d8ee980ee21f548bfe42965d13d64d',
      symbol: 'SBT',
      decimals: 18,
      color: 'FFAA00',
    },
    {
      currency: '0xc00fd9820cd2898cc4c054b7bf142de637ad129a',
      symbol: 'WETH',
      decimals: 18,
      color: 'FFAA00',
    },
    {
      currency: '0x583cbbb8a8443b38abcc0c956bece47340ea1367',
      symbol: 'BOKKY',
      decimals: 18,
      color: 'FFAA00',
    },
    {
      currency: 'ETH',
      symbol: 'ETH',
      decimals: 18,
      color: '5C78E4',
    },
  ],
});

export const supportedAssetsLoadingMock = fromJS({
  loading: true,
  error: null,
  assets: [],
});

export const supportedAssetsErrorMock = fromJS({
  loading: false,
  error: true,
  assets: [],
});


// selectHubiiApiHocDomain
export const hubiiApiHocMock = fromJS({
  balances: balancesMock,
  supportedAssets: supportedAssetsLoadedMock,
  transactions: transactionsMock,
  prices: pricesLoadedMock,
});

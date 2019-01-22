import { fromJS } from 'immutable';


export const loadedWalletTransactions = fromJS({
  '0x1c7429f62595097315289ceBaC1fDbdA587Ad512': {
    loading: false,
    error: null,
    transactions: [{
      amount: '100000000',
      block: { number: 3780091, timestamp: '2018-08-06T02:32:00.000Z' },
      currency: '0x0000000000000000000000000000000000000000',
      hash: '0x84db5d53f1b5e82bdae027408989cf5451191d76b8b021710cfa0d95bbd5d34c',
      recipient: '0x1c7429f62595097315289ceBaC1fDbdA587Ad512',
      sender: '0x910c4ba923b2243dc13e00a066eefb8ffd905eb0',
    },
    {
      // 0 ETH tx, should be ignored
      amount: '0',
      block: { number: 3780091, timestamp: '2018-08-06T02:32:00.000Z' },
      currency: '0x0000000000000000000000000000000000000000',
      hash: '0x84db5d53f1b5e82bdae027408989cf5451191d76b8b021710cfa0d95bbd5d34c',
      recipient: '0x1c7429f62595097315289ceBaC1fDbdA587Ad512',
      sender: '0x910c4ba923b2243dc13e00a066eefb8ffd905eb0',
    },
    {
      // unsupported currency, should be ignored
      amount: '10',
      block: { number: 3780091, timestamp: '2018-08-06T02:32:00.000Z' },
      currency: 'DOESNOTEXIST',
      hash: '0x84db5d53f1b5e82bdae027408989cf5451191d76b8b021710cfa0d95bbd5d34c',
      recipient: '0x1c7429f62595097315289ceBaC1fDbdA587Ad512',
      sender: '0x910c4ba923b2243dc13e00a066eefb8ffd905eb0',
    },
    {
      // tx to self, should be ignored
      amount: '10',
      block: { number: 3780091, timestamp: '2018-08-06T02:32:00.000Z' },
      currency: 'DOESNOTEXIST',
      hash: '0x84db5d53f1b5e82bdae027408989cf5451191d76b8b021710cfa0d95bbd5d34c',
      recipient: '0x1c7429f62595097315289ceBaC1fDbdA587Ad512',
      sender: '0x1c7429f62595097315289ceBaC1fDbdA587Ad512',
    },
    {
      amount: '5',
      block: { number: 3780089, timestamp: '2018-08-06T02:32:00.000Z' },
      currency: '0x583cbbb8a8443b38abcc0c956bece47340ea1367', // BOKKY
      hash: '0x84db5d53f1b5e82bdae027408989cf5451191d76b8b021710cfa0d95bbd5d34c',
      recipient: '0x910c4ba923b2243dc13e00a066eefb8ffd905eb0',
      sender: '0x1c7429f62595097315289ceBaC1fDbdA587Ad512',
    }],
  },
});

export const loadingWalletTransactions = fromJS({
  '0x82191e2863E0b6AFC0A7D538cdabfd509aA648b5': {
    loading: true,
    error: null,
    transactions: [],
  },
});

export const errorWalletTransactions = fromJS({
  '0xF4db7c6030c9c5754A6A712212d6342DCA52e25d': {
    loading: false,
    error: true,
    transactions: [],
  },
});

export const supportedTokensMock = [
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
    currency: '0x0000000000000000000000000000000000000000',
    symbol: 'ETH',
    decimals: 18,
    color: '5C78E4',
  },
];

import { fromJS } from 'immutable';

import {
  lnsWalletMock,
  trezorWalletMock,
  encryptedSoftwareWallet1Mock,
  decryptedSoftwareWallet2Mock,
} from 'containers/WalletHoc/tests/mocks';

import { balanceState, totalExpected } from './index';

// makeSelectReceipts
export const receiptsEmpty = fromJS({});
export const receiptsError = fromJS({
  '0x1c7429f62595097315289ceBaC1fDbdA587Ad512': {
    loading: false,
    error: 'some error',
  },
});

export const receiptsLoading = fromJS({
  '0x1c7429f62595097315289ceBaC1fDbdA587Ad512': {
    loading: true,
    error: null,
  },
});

export const receiptsLoaded = fromJS({
  '0x1c7429f62595097315289ceBaC1fDbdA587Ad512': {
    loading: false,
    error: null,
    receipts: [
      {
        seals: {
          wallet: {
            hash:
              '0x57d9cf4ffc4b2aecce23d2e56083c7b437f5e105be74c1cd17d8522999b5d0be',
            signature: {
              s:
                '0x395b632dab03b34321c1aed7dcbac4a1b87582904d2898645b3ec90505c44348',
              r:
                '0x01cda7bddbc7c2194dd395aac73eaf1ca6760bfef83689c5a1240f936f0200d4',
              v: 28,
            },
          },
          operator: {
            hash:
              '0x99c1a3a1cd8b15cdb969270f6e8f7fdce5b9c8377a00c38d800b9982c98eec5a',
            signature: {
              s:
                '0x129c9e071467ee98ddd799fa1ed7b3cbda11486955b9360afd22ce0ff4d91aab',
              r:
                '0x4d22165ff7382f998107a87e800a11581e7b99fa67ab613656706105157e5ab9',
              v: 28,
            },
          },
        },
        transfers: { single: '2111000000', total: '3111000000' },
        nonce: 21,
        currency: { ct: '0x0000000000000000000000000000000000000000', id: '0' },
        amount: '2111000000',
        sender: {
          fees: {
            total: [
              {
                originId: '0',
                figure: {
                  currency: {
                    ct: '0x0000000000000000000000000000000000000000',
                    id: '0',
                  },
                  amount: '4121100',
                },
              },
            ],
            single: {
              currency: {
                ct: '0x0000000000000000000000000000000000000000',
                id: '0',
              },
              amount: '2111000',
            },
          },
          wallet: '0x4231676a35483638796e2af8ed2af0a41b097524',
          nonce: 7,
          balances: { current: '999995875778900', previous: '999997988889900' },
        },
        recipient: {
          fees: { total: [] },
          wallet: '0x1c7429f62595097315289cebac1fdbda587ad512',
          nonce: 4,
          balances: { current: '10013111000000', previous: '10011000000000' },
        },
        blockNumber: '4643058',
        operatorId: '0',
        created: '2018-12-17T01:59:03.718Z',
        updated: '2018-12-17T01:59:03.776Z',
        id: '5c1702e78d9ea3000ea459d9',
      },
      {
        seals: {
          wallet: {
            hash:
              '0x0b7d6d30e9665016246e6370e82579a35bc4d9c0cf88c65b38d538f7ad8ee828',
            signature: {
              s:
                '0x7d60c93b9037be6d880bbe86f258d0e371ad4015fc2528cf1312d924f9e76245',
              r:
                '0x9c11c2a5244a741f67837eb6efc1f12396c19d2490ff2bd872dbd9643a7c1013',
              v: 27,
            },
          },
          operator: {
            hash:
              '0x92b0e8b3c705449eea1bce2e517468cec521e6451d4a7e6c4fe4c4efe7df6ab4',
            signature: {
              s:
                '0x09ad154d886899b36f15a2be68ddb61c15afe185acd498a9b6bb2577f317a942',
              r:
                '0x80d8f5e899f16c9a4abcc72d23399d4ddd3c08a29dae8233a46179ef54cc189c',
              v: 27,
            },
          },
        },
        transfers: { single: '10000000000000000', total: '10000000000000000' },
        nonce: 18,
        currency: { ct: '0x583cbbb8a8443b38abcc0c956bece47340ea1367', id: '0' },
        amount: '10000000000000000',
        sender: {
          fees: {
            total: [
              {
                originId: '0',
                figure: {
                  currency: {
                    ct: '0x583cbbb8a8443b38abcc0c956bece47340ea1367',
                    id: '0',
                  },
                  amount: '10000000000000',
                },
              },
            ],
            single: {
              currency: {
                ct: '0x583cbbb8a8443b38abcc0c956bece47340ea1367',
                id: '0',
              },
              amount: '10000000000000',
            },
          },
          wallet: '0x1c7429f62595097315289cebac1fdbda587ad512',
          nonce: 3,
          balances: {
            current: '89990000000000000',
            previous: '100000000000000000',
          },
        },
        recipient: {
          fees: { total: [] },
          wallet: '0xc5768cdeda275fe5536147a3fbc8cfb6b0d8ac48',
          nonce: 2,
          balances: { current: '10000000000000000', previous: '0' },
        },
        blockNumber: '3780090',
        operatorId: '0',
        created: '2018-11-16T22:40:54.951Z',
        updated: '2018-11-16T22:40:55.049Z',
        id: '5c16d4768d9ea3000ea45690',
      },
    ],
  },
  '0xF4db7c6030c9c5754A6A712212d6342DCA52e25d': {
    loading: false,
    error: true,
    receipts: [],
  },
});

// makeSelectReceiptsWithInfo
export const receiptsWithInfo = receiptsLoaded
  .setIn(
    ['0x1c7429f62595097315289ceBaC1fDbdA587Ad512', 'receipts', 1, 'type'],
    'sent'
  )
  .setIn(
    ['0x1c7429f62595097315289ceBaC1fDbdA587Ad512', 'receipts', 1, 'timestamp'],
    receiptsLoaded.getIn(['0x1c7429f62595097315289ceBaC1fDbdA587Ad512', 'receipts', 1, 'updated']),
  )
  .setIn(
    ['0x1c7429f62595097315289ceBaC1fDbdA587Ad512', 'receipts', 1, 'fiatValue'],
    '0.01'
  )
  .setIn(
    ['0x1c7429f62595097315289ceBaC1fDbdA587Ad512', 'receipts', 1, 'symbol'],
    'BOKKY'
  )
  .setIn(
    ['0x1c7429f62595097315289ceBaC1fDbdA587Ad512', 'receipts', 1, 'blockNumber'],
    3780090
  )
  .setIn(
    ['0x1c7429f62595097315289ceBaC1fDbdA587Ad512', 'receipts', 1, 'layer'],
    'nahmii'
  )
  .setIn(
    ['0x1c7429f62595097315289ceBaC1fDbdA587Ad512', 'receipts', 1, 'decimalAmount'],
    '0.01'
  )
  .setIn(
    ['0x1c7429f62595097315289ceBaC1fDbdA587Ad512', 'receipts', 1, 'counterpartyAddress'],
    '0xc5768cdeda275fe5536147a3fbc8cfb6b0d8ac48'
  )
  .setIn(
    ['0x1c7429f62595097315289ceBaC1fDbdA587Ad512', 'receipts', 1, 'currency'],
    '0x583cbbb8a8443b38abcc0c956bece47340ea1367'
  )
  .setIn(
    ['0x1c7429f62595097315289ceBaC1fDbdA587Ad512', 'receipts', 1, 'confirmed'],
    true
  )
  .setIn(
    ['0x1c7429f62595097315289ceBaC1fDbdA587Ad512', 'receipts', 0, 'type'],
    'received'
  )
  .setIn(
    ['0x1c7429f62595097315289ceBaC1fDbdA587Ad512', 'receipts', 0, 'timestamp'],
    receiptsLoaded.getIn(['0x1c7429f62595097315289ceBaC1fDbdA587Ad512', 'receipts', 0, 'updated']),
  )
  .setIn(
    ['0x1c7429f62595097315289ceBaC1fDbdA587Ad512', 'receipts', 0, 'fiatValue'],
    '0.000000869732'
  )
  .setIn(
    ['0x1c7429f62595097315289ceBaC1fDbdA587Ad512', 'receipts', 0, 'symbol'],
    'ETH'
  )
  .setIn(
    ['0x1c7429f62595097315289ceBaC1fDbdA587Ad512', 'receipts', 0, 'blockNumber'],
    4643058
  )
  .setIn(
    ['0x1c7429f62595097315289ceBaC1fDbdA587Ad512', 'receipts', 0, 'layer'],
    'nahmii'
  )
  .setIn(
    ['0x1c7429f62595097315289ceBaC1fDbdA587Ad512', 'receipts', 0, 'decimalAmount'],
    '0.000000002111'
  )
  .setIn(
    ['0x1c7429f62595097315289ceBaC1fDbdA587Ad512', 'receipts', 0, 'counterpartyAddress'],
    '0x4231676a35483638796e2af8ed2af0a41b097524'
  )
  .setIn(
    ['0x1c7429f62595097315289ceBaC1fDbdA587Ad512', 'receipts', 0, 'currency'],
    'ETH'
  )
  .setIn(
    ['0x1c7429f62595097315289ceBaC1fDbdA587Ad512', 'receipts', 0, 'confirmed'],
    true
  );

// makeSelectNahmiiBalances
export const balancesEmpty = fromJS({});
export const balances = balanceState
  .setIn([lnsWalletMock.get('address'), 'total'], totalExpected)
  .setIn(
    [trezorWalletMock.get('address'), 'total'],
    totalExpected.set('assets', fromJS([]))
  )
  .setIn(
    [encryptedSoftwareWallet1Mock.get('address'), 'total'],
    totalExpected.set('assets', fromJS([])).set('error', 'someerror')
  )
  .setIn(
    [decryptedSoftwareWallet2Mock.get('address'), 'total'],
    totalExpected.set('assets', fromJS([])).set('loading', true)
  );

// makeSelectDepositStatus
export const depositStatusNone = fromJS({
  depositingEth: false,
  approvingTokenDeposit: false,
  completingTokenDeposit: false,
  error: null,
});

export const depositStatusEth = depositStatusNone.set('depositingEth', true);
export const depositStatusApproving = depositStatusNone.set(
  'approvingTokenDeposit',
  true
);
export const depositStatusCompleting = depositStatusNone.set(
  'completingTokenDeposit',
  true
);
export const depositStatusError = depositStatusNone.set(
  'error',
  'some error message'
);

// selectNahmiiHocDomain
export const nahmiiHocMock = fromJS({
  balances: balanceState,
  receipts: receiptsLoaded,
});

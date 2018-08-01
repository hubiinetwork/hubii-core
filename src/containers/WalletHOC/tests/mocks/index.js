import { fromJS } from 'immutable';
import BigNumber from 'bignumber.js';

export const address1Mock = '0x910c4BA923B2243dc13e00A066eEfb8ffd905EB0';

export const contactsMock = fromJS([
  {
    name: 'mike',
    address: '0x123123',
  },
  {
    name: 'john',
    address: '0x1231323',
  },
  {
    name: 'hayley',
    address: '0x112312123',
  },
]);

export const walletsMock = fromJS([
  {
    name: '1',
    address: '0x910c4BA923B2243dc13e00A066eEfb8ffd905EB0',
    type: 'software',
    encrypted:
      '{"address":"910c4ba923b2243dc13e00a066eefb8ffd905eb0","id":"ae1eb0e5-f3e6-4bc8-b23c-1b6efb8e7f4e","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"160194dccdc2e29f98bc0b02f811dc95"},"ciphertext":"1e787b400e5fc733590fbf3a4cd547e81a1004cd3c7403f68416be472500915a","kdf":"scrypt","kdfparams":{"salt":"8adc2aed2709e8de54ba69903d102f25c8d87920f1f5cd952fa0c000aa7c91ac","n":131072,"dklen":32,"p":1,"r":8},"mac":"952bcd9627ada0a96e83dd9feb4bdc6c47a39f4d20db0e9d649f6b247e5538ff"}}',
    balances: [
      {
        symbol: 'ETH',
        balance: '299727698850000000',
        price: { USD: 487.23 },
        primaryColor: '5C78E4',
        decimals: 18,
      },
    ],
    loadingBalances: false,
    loadingBalancesError: null,
  },
  {
    name: '123123123123',
    address: '0xB09806807915422C4EbfB98E246ba78a1F34De73',
    type: 'software',
    encrypted:
      '{"address":"b09806807915422c4ebfb98e246ba78a1f34de73","id":"5aef699b-2288-44f2-a2b4-746e2413dc53","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"42c622549458c3ccbc927b24cac4e061"},"ciphertext":"bcbc5c2ad94353637803c02d5187557a0c25bec97c5c2710bee5b85fc62de478","kdf":"scrypt","kdfparams":{"salt":"39c7545fa5aa25d252a8649553081a61314de5b43a8d5d10e6c3f52fbd9e0718","n":131072,"dklen":32,"p":1,"r":8},"mac":"909eb191b0a6089669997ddb0c1a6cb26e2ff6cb06e8ccf1b82a430ac801cd86"}}',
    balances: [
      {
        symbol: 'ETH',
        balance: '500937000000000000',
        price: { USD: 487.23 },
        primaryColor: '5C78E4',
        decimals: 18,
      },
    ],
    loadingBalances: false,
    loadingBalancesError: null,
  },
  {
    name: 'empty',
    address: '0xcdb391dC27Ecb78Bc96E597A16b0eC312000Ba4C',
    type: 'software',
    encrypted:
      '{"address":"cdb391dc27ecb78bc96e597a16b0ec312000ba4c","id":"758b0e4b-369c-45c1-868e-25376b9f810f","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"ca2fe714718c7ce3fc5ac663f8fd3c1f"},"ciphertext":"0357242c930a884999dfd90c412d2c7271b32e7cd0879a94e811898e3b180d0e","kdf":"scrypt","kdfparams":{"salt":"71b8601c41fa3825603f9496220234ec1c37470410f52d1d729ca603f23923e3","n":131072,"dklen":32,"p":1,"r":8},"mac":"e697f0976d2f33e990d8da47d343cdb114b45a313723852af169c26ca4a28575"},"x-ethers":{"client":"ethers.js","gethFilename":"UTC--2018-07-23T22-19-49.0Z--cdb391dc27ecb78bc96e597a16b0ec312000ba4c","mnemonicCounter":"8a074b6326227fefd8238bc3d4e8f784","mnemonicCiphertext":"73ec3ba3832aab02e65c920d8ad18775","version":"0.1"}}',
    balances: [
      {
        symbol: 'ETH',
        balance: '0',
        price: { USD: 487.23 },
        primaryColor: '5C78E4',
        decimals: 18,
      },
    ],
    loadingBalances: false,
    loadingBalancesError: null,
  },
  {
    deviceId:
      '041ca8e96420e95a106e8c9bb3c9fb9e8c00d4b11cac562888c898000b5cec366c03a0f84574716fac6c7a7df47a925f0e30f5286546adf3179b5a08dc9d8e09da',
    address: '0xc8b4217365dc359eF2e1890d72d0d9a7B643456c',
    type: 'lns',
    name: '123456',
    derivationPath: "m/44'/60'/0'/1",
    loadingBalances: false,
    loadingBalancesError: null,
    balances: [
      {
        symbol: 'ETH',
        balance: '0',
        price: { USD: 487.23 },
        primaryColor: '5C78E4',
        decimals: 18,
      },
    ],
  },
  {
    name: '123',
    address: '0xd6E72FD622f36dF68786377f8Cb4F99cAc817dE8',
    type: 'software',
    encrypted:
      '{"address":"d6e72fd622f36df68786377f8cb4f99cac817de8","id":"166df706-a20e-4327-beb3-40f47d7794ec","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"17bbe232d5799a1dbd0a72113579f87c"},"ciphertext":"51db270fb7df3689ba5635a86610e831aaa3505fc160167c2273488df8194fc6","kdf":"scrypt","kdfparams":{"salt":"be1edda7fc2d8c3e8461dc801a80a614e7304a8e603b58837abb33a26ac55e2a","n":131072,"dklen":32,"p":1,"r":8},"mac":"e35f0d4c0e8c7dce88cd3c7770e6337dbc987af497e767b55c4c5f5c6c5bc627"},"x-ethers":{"client":"ethers.js","gethFilename":"UTC--2018-07-24T23-51-27.0Z--d6e72fd622f36df68786377f8cb4f99cac817de8","mnemonicCounter":"9faf6f2a5b8c73bc813ad6816244cdc8","mnemonicCiphertext":"55fe53abdda6f826fa7d393d49513016","version":"0.1"}}',
    balances: [
      {
        symbol: 'ETH',
        balance: '0',
        price: { USD: 487.23 },
        primaryColor: '5C78E4',
        decimals: 18,
      },
    ],
    loadingBalances: false,
    loadingBalancesError: null,
  },
  {
    deviceId:
      '041ca8e96420e95a106e8c9bb3c9fb9e8c00d4b11cac562888c898000b5cec366c03a0f84574716fac6c7a7df47a925f0e30f5286546adf3179b5a08dc9d8e09da',
    address: '0x1c7429f62595097315289ceBaC1fDbdA587Ad512',
    type: 'lns',
    name: 'lns',
    derivationPath: "m/44'/60'/0'/0",
    loadingBalances: false,
    loadingBalancesError: null,
    balances: [
      {
        symbol: 'ETH',
        balance: '198937000000000000',
        price: { USD: 487.23 },
        primaryColor: '5C78E4',
        decimals: 18,
      },
    ],
  },
]);

export const totalBalancesMock = fromJS({
  assets: {
    ETH: { amount: new BigNumber('0.99960169885'), usdValue: new BigNumber('411.8358999262') },
    '0x583cbbb8a8443b38abcc0c956bece47340ea1367': { amount: new BigNumber('1'), usdValue: new BigNumber('0') },
  },
  loading: false,
  totalUsd: new BigNumber('411.8358999262'),
});

export const balancesMock = fromJS({
  '0x910c4BA923B2243dc13e00A066eEfb8ffd905EB0': {
    loading: false,
    error: null,
    assets: [
      {
        address: '0x910c4BA923B2243dc13e00A066eEfb8ffd905EB0',
        currency: 'ETH',
        balance: '299727698850000000',
      },
      {
        address: '0x910c4BA923B2243dc13e00A066eEfb8ffd905EB0',
        currency: '0x583cbbb8a8443b38abcc0c956bece47340ea1367',
        balance: '1000000000000000000',
      },
    ],
  },
  '0xB09806807915422C4EbfB98E246ba78a1F34De73': {
    loading: false,
    error: null,
    assets: [
      {
        address: '0xB09806807915422C4EbfB98E246ba78a1F34De73',
        currency: 'ETH',
        balance: '500937000000000000',
      },
    ],
  },
  '0xcdb391dC27Ecb78Bc96E597A16b0eC312000Ba4C': {
    loading: false,
    error: null,
    assets: [
      {
        address: '0xcdb391dC27Ecb78Bc96E597A16b0eC312000Ba4C',
        currency: 'ETH',
        balance: '0',
      },
    ],
  },
  '0xc8b4217365dc359eF2e1890d72d0d9a7B643456c': {
    loading: false,
    error: null,
    assets: [
      {
        address: '0xc8b4217365dc359eF2e1890d72d0d9a7B643456c',
        currency: 'ETH',
        balance: '0',
      },
    ],
  },
  '0xd6E72FD622f36dF68786377f8Cb4F99cAc817dE8': {
    loading: false,
    error: null,
    assets: [
      {
        address: '0xd6E72FD622f36dF68786377f8Cb4F99cAc817dE8',
        currency: 'ETH',
        balance: '0',
      },
    ],
  },
  '0x1c7429f62595097315289ceBaC1fDbdA587Ad512': {
    loading: false,
    error: null,
    assets: [
      {
        address: '0x1c7429f62595097315289ceBaC1fDbdA587Ad512',
        currency: 'ETH',
        balance: '198937000000000000',
      },
    ],
  },
});

export const pricesMock = fromJS({
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
      eth: 0,
      btc: 0,
      usd: 0,
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
];

export const supportedAssetsMock = fromJS({
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

export const currentWalletMock = fromJS({
  address: '0x910c4BA923B2243dc13e00A066eEfb8ffd905EB0',
});

export const walletsWithInfoMock = fromJS([
  {
    name: '1',
    address: '0x910c4BA923B2243dc13e00A066eEfb8ffd905EB0',
    type: 'software',
    encrypted:
      '{"address":"910c4ba923b2243dc13e00a066eefb8ffd905eb0","id":"ae1eb0e5-f3e6-4bc8-b23c-1b6efb8e7f4e","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"160194dccdc2e29f98bc0b02f811dc95"},"ciphertext":"1e787b400e5fc733590fbf3a4cd547e81a1004cd3c7403f68416be472500915a","kdf":"scrypt","kdfparams":{"salt":"8adc2aed2709e8de54ba69903d102f25c8d87920f1f5cd952fa0c000aa7c91ac","n":131072,"dklen":32,"p":1,"r":8},"mac":"952bcd9627ada0a96e83dd9feb4bdc6c47a39f4d20db0e9d649f6b247e5538ff"}}',
    balances: {
      loading: false,
      error: null,
      assets: [
        {
          balance: new BigNumber('0.29972769885'),
          currency: 'ETH',
          symbol: 'ETH',
          value: {
            eth: new BigNumber('0.29972769885'),
            btc: new BigNumber('0.0029972769885'),
            usd: new BigNumber('123.4878119262'),
          },
        },
        {
          balance: new BigNumber('1'),
          currency: '0x583cbbb8a8443b38abcc0c956bece47340ea1367',
          symbol: 'BOKKY',
          value: { eth: new BigNumber('0'), btc: new BigNumber('0'), usd: new BigNumber('0') },
        },
      ],
      total: {
        eth: new BigNumber('0.29972769885'),
        btc: new BigNumber('0.0029972769885'),
        usd: new BigNumber('123.4878119262'),
      },
    },
    loadingBalances: false,
    loadingBalancesError: null,
  },
  {
    name: '123123123123',
    address: '0xB09806807915422C4EbfB98E246ba78a1F34De73',
    type: 'software',
    encrypted:
      '{"address":"b09806807915422c4ebfb98e246ba78a1f34de73","id":"5aef699b-2288-44f2-a2b4-746e2413dc53","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"42c622549458c3ccbc927b24cac4e061"},"ciphertext":"bcbc5c2ad94353637803c02d5187557a0c25bec97c5c2710bee5b85fc62de478","kdf":"scrypt","kdfparams":{"salt":"39c7545fa5aa25d252a8649553081a61314de5b43a8d5d10e6c3f52fbd9e0718","n":131072,"dklen":32,"p":1,"r":8},"mac":"909eb191b0a6089669997ddb0c1a6cb26e2ff6cb06e8ccf1b82a430ac801cd86"}}',
    balances: {
      loading: false,
      error: null,
      assets: [
        {
          balance: new BigNumber('0.500937'),
          currency: 'ETH',
          symbol: 'ETH',
          value: { eth: new BigNumber('0.500937'), btc: new BigNumber('0.00500937'), usd: new BigNumber('206.386044') },
        },
      ],
      total: { eth: new BigNumber('0.500937'), btc: new BigNumber('0.00500937'), usd: new BigNumber('206.386044') },
    },
    loadingBalances: false,
    loadingBalancesError: null,
  },
  {
    name: 'empty',
    address: '0xcdb391dC27Ecb78Bc96E597A16b0eC312000Ba4C',
    type: 'software',
    encrypted:
      '{"address":"cdb391dc27ecb78bc96e597a16b0ec312000ba4c","id":"758b0e4b-369c-45c1-868e-25376b9f810f","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"ca2fe714718c7ce3fc5ac663f8fd3c1f"},"ciphertext":"0357242c930a884999dfd90c412d2c7271b32e7cd0879a94e811898e3b180d0e","kdf":"scrypt","kdfparams":{"salt":"71b8601c41fa3825603f9496220234ec1c37470410f52d1d729ca603f23923e3","n":131072,"dklen":32,"p":1,"r":8},"mac":"e697f0976d2f33e990d8da47d343cdb114b45a313723852af169c26ca4a28575"},"x-ethers":{"client":"ethers.js","gethFilename":"UTC--2018-07-23T22-19-49.0Z--cdb391dc27ecb78bc96e597a16b0ec312000ba4c","mnemonicCounter":"8a074b6326227fefd8238bc3d4e8f784","mnemonicCiphertext":"73ec3ba3832aab02e65c920d8ad18775","version":"0.1"}}',
    balances: {
      loading: false,
      error: null,
      assets: [
        {
          balance: new BigNumber('0'),
          currency: 'ETH',
          symbol: 'ETH',
          value: { eth: new BigNumber('0'), btc: new BigNumber('0'), usd: new BigNumber('0') },
        },
      ],
      total: { eth: new BigNumber('0'), btc: new BigNumber('0'), usd: new BigNumber('0') },
    },
    loadingBalances: false,
    loadingBalancesError: null,
  },
  {
    deviceId:
      '041ca8e96420e95a106e8c9bb3c9fb9e8c00d4b11cac562888c898000b5cec366c03a0f84574716fac6c7a7df47a925f0e30f5286546adf3179b5a08dc9d8e09da',
    address: '0xc8b4217365dc359eF2e1890d72d0d9a7B643456c',
    type: 'lns',
    name: '123456',
    derivationPath: "m/44'/60'/0'/1",
    loadingBalances: false,
    loadingBalancesError: null,
    balances: {
      loading: false,
      error: null,
      assets: [
        {
          balance: new BigNumber('0'),
          currency: 'ETH',
          symbol: 'ETH',
          value: { eth: new BigNumber('0'), btc: new BigNumber('0'), usd: new BigNumber('0') },
        },
      ],
      total: { eth: new BigNumber('0'), btc: new BigNumber('0'), usd: new BigNumber('0') },
    },
  },
  {
    name: '123',
    address: '0xd6E72FD622f36dF68786377f8Cb4F99cAc817dE8',
    type: 'software',
    encrypted:
      '{"address":"d6e72fd622f36df68786377f8cb4f99cac817de8","id":"166df706-a20e-4327-beb3-40f47d7794ec","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"17bbe232d5799a1dbd0a72113579f87c"},"ciphertext":"51db270fb7df3689ba5635a86610e831aaa3505fc160167c2273488df8194fc6","kdf":"scrypt","kdfparams":{"salt":"be1edda7fc2d8c3e8461dc801a80a614e7304a8e603b58837abb33a26ac55e2a","n":131072,"dklen":32,"p":1,"r":8},"mac":"e35f0d4c0e8c7dce88cd3c7770e6337dbc987af497e767b55c4c5f5c6c5bc627"},"x-ethers":{"client":"ethers.js","gethFilename":"UTC--2018-07-24T23-51-27.0Z--d6e72fd622f36df68786377f8cb4f99cac817de8","mnemonicCounter":"9faf6f2a5b8c73bc813ad6816244cdc8","mnemonicCiphertext":"55fe53abdda6f826fa7d393d49513016","version":"0.1"}}',
    balances: {
      loading: false,
      error: null,
      assets: [
        {
          balance: new BigNumber('0'),
          currency: 'ETH',
          symbol: 'ETH',
          value: { eth: new BigNumber('0'), btc: new BigNumber('0'), usd: new BigNumber('0') },
        },
      ],
      total: { eth: new BigNumber('0'), btc: new BigNumber('0'), usd: new BigNumber('0') },
    },
    loadingBalances: false,
    loadingBalancesError: null,
  },
  {
    deviceId:
      '041ca8e96420e95a106e8c9bb3c9fb9e8c00d4b11cac562888c898000b5cec366c03a0f84574716fac6c7a7df47a925f0e30f5286546adf3179b5a08dc9d8e09da',
    address: '0x1c7429f62595097315289ceBaC1fDbdA587Ad512',
    type: 'lns',
    name: 'lns',
    derivationPath: "m/44'/60'/0'/0",
    loadingBalances: false,
    loadingBalancesError: null,
    balances: {
      loading: false,
      error: null,
      assets: [
        {
          balance: new BigNumber('0.198937'),
          currency: 'ETH',
          symbol: 'ETH',
          value: { eth: new BigNumber('0.198937'), btc: new BigNumber('0.00198937'), usd: new BigNumber('81.962044') },
        },
      ],
      total: { eth: new BigNumber('0.198937'), btc: new BigNumber('0.00198937'), usd: new BigNumber('81.962044') },
    },
  },
]);

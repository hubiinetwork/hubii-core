const receipts = [{
  nonce: 1,
  amount: '5000000000000000000',
  currency: {
    ct: '0x0000000000000000000000000000000000000000',
    id: '0',
  },
  sender: {
    wallet: '0x97026a8157f39101aefc4A81496C161a6b1Ce46A',
    nonce: 1,
    balances: {
      current: '4800000000000000000',
      previous: '10000000000000000000',
    },
    fees: {
      single: {
        amount: '200000000000000000',
        currency: {
          ct: '0x0000000000000000000000000000000000000000',
          id: '0',
        },
      },
      total: [
        {
          originId: '0',
          figure: {
            amount: '200000000000000000',
            currency: {
              ct: '0x0000000000000000000000000000000000000000',
              id: '0',
            },
          },
        },
      ],
    },
  },
  recipient: {
    wallet: '0xBB97f342884eD086dd83a192c8a7e649E095DB7b',
    nonce: 1,
    balances: {
      current: '5000000000000000000',
      previous: '0',
    },
    fees: {
      total: [],
    },
  },
  transfers: {
    single: '5000000000000000000',
    total: '10000000000000000000',
  },
  blockNumber: '283',
  operatorId: '1',
  seals: {
    wallet: {
      hash: '0x424f956befa5a84763afe5202876bc15cd0fc0c448ead6efa35fa4d8a93e728c',
      signature: {
        s: '0x5e5b343ea4176bd408f1e126ec4f64e3f5735e1dc2639e54544ba6d686a6924d',
        r: '0x3c2ae3eb67ad66db58cbbc263eba3d6507cd437109ea70af5de7c88ae7651c28',
        v: 27,
      },
    },
    operator: {
      hash: '0x89510a30a275392cccb2b4668da6d44bdddd4054cfddc308e33f6b72389fc84d',
      signature: {
        s: '0x1c639c3d94fda6a304897cab175ef3f5dd6ab2e368e4eed4d32c13d4514e0e01',
        r: '0xd68b88b8b8325d3a0c623975fe7f04775ccd98756d2d6a58afba9d643418d130',
        v: 27,
      },
    },
  },
}];

const f = global.fetch;

global.fetch = (url, opts) => {
  if (url.indexOf('trading/wallets/0x97026a8157f39101aefc4A81496C161a6b1Ce46A/receipts?') !== -1) {
    return new Promise((resolve) => {
      resolve({ status: 200, json: () => receipts });
    });
  }
  if (url.indexOf('ethereum/supported-tokens') !== -1) {
    return new Promise((resolve) => {
      const result = [
        { currency: '0x0000000000000000000000000000000000000000', symbol: 'ETH', decimals: 18, color: '#0063A5' },
        // {currency: "0x9d35b9dc0ef17acc3a8872566694cda9fb484f34", symbol: "TTT", decimals: 18, color: "#0063A5"},
      ];
      resolve({ status: 200, json: () => result });
    });
  }
  return f(url, opts);
};

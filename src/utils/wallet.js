import { providers } from 'ethers';

export function convertWalletsList(walletsState) {
  const walletsJSON = walletsState.toJS();
  const wallets = [];
  Object.keys(walletsJSON).forEach((type) => {
    Object.keys(walletsJSON[type]).forEach((walletName) => {
      try {
        const wallet = walletsJSON[type][walletName];
        wallet.encrypted = JSON.parse(wallet.encrypted);
        wallet.type = type;
        wallet.name = walletName;
        wallet.address = `0x${wallet.encrypted.address}`;
        wallets.push(wallet);
      } catch (e) {
        return e;
      }
      return walletName;
    });
    return type;
  });
  return wallets;
}

export function getTotalUSDValue(balances) {
  if (!balances) {
    return 0;
  }
  const assets = balances.map((token) => ({
    amount: parseInt(token.balance, 10) / (10 ** token.decimals),
    price: token.price,
  }));
  return assets.reduce((accumulator, current) => accumulator + (parseFloat(current.price.USD, 10) * current.amount), 0);
}

export const ERC20ABI = [
  {
    name: 'transfer',
    type: 'function',
    inputs: [
      {
        name: '_to',
        type: 'address',
      },
      {
        type: 'uint256',
        name: '_tokens',
      },
    ],
    constant: false,
    outputs: [],
    payable: false,
  },
];

export const EthNetworkProvider = providers.getDefaultProvider(process.env.NETWORK || 'ropsten');

export const IsAddressMatch = (a, b) => a.toLowerCase() === b.toLowerCase();

export const parseBigNumber = (bignumber, decimals) => parseInt(bignumber, 10) / (10 ** decimals);

import { providers } from 'ethers';

export function convertWalletsList(walletsState) {
  const walletsObject = walletsState.toJS();
  const processedWallets = [];
  walletsObject.forEach((wallet) => {
    const curWallet = { ...wallet };
    if (wallet.type === 'software') {
      curWallet.encrypted = JSON.parse(wallet.encrypted);
      curWallet.address = `0x${curWallet.encrypted.address}`;
    }
    processedWallets.push(curWallet);
  });
  return processedWallets;
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

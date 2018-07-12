import { providers } from 'ethers';
import fatalError from './fatalError';

export function convertWalletsList(walletsState) {
  const walletsObject = walletsState.toJS();
  const processedWallets = [];
  walletsObject.forEach((wallet) => {
    const curWallet = { ...wallet };
    if (wallet.type === 'software') {
      curWallet.encrypted = JSON.parse(wallet.encrypted);
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

// A short and safe way of finding the index of a wallet stored in wallet state
// using it's address
export const findWalletIndex = (state, address, scopedFatalError = fatalError) => {
  try {
    const index = state.get('wallets').findIndex((w) => w.get('address') === address);
    if (index < 0) throw new Error(`Tried to find index of non-existent wallet with address ${address}`);
    return index;
  } catch (e) {
    return scopedFatalError(e);
  }
};

export const EthNetworkProvider = providers.getDefaultProvider(process.env.NETWORK || 'ropsten');

export const IsAddressMatch = (a, b) => a.toLowerCase() === b.toLowerCase();

export const parseBigNumber = (bignumber, decimals) => parseInt(bignumber, 10) / (10 ** decimals);

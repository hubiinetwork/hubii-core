import { List, Map } from 'immutable';
import { publicToAddress } from 'ethereumjs-util';
import HDKey from 'hdkey';
import BigNumber from 'bignumber.js';
import fatalError from './fatalError';

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

export const getBreakdown = (balances, supportedAssets) => {
    // convert balances to Map if they're in array form
  let formattedBalances = balances;
  if (balances.get('assets') && List.isList(balances.get('assets'))) {
    const assetsAsObj = balances
        .get('assets')
        .reduce((acc, asset) => acc.set(asset.get('currency'), asset), new Map());
    formattedBalances = balances.set('assets', assetsAsObj);
  }

  const totalFiat = formattedBalances.getIn(['total', 'usd']);

  return formattedBalances.get('assets').keySeq().map((asset) => ({
    label: getCurrencySymbol(supportedAssets, asset),
    percentage: (formattedBalances.getIn(['assets', asset, 'value', 'usd']) / totalFiat) * 100,
    color: supportedAssets.get('assets').find((a) => a.get('currency') === asset).get('color'),
  })).toJS();
};

export const getCurrencySymbol = (supportedAssets, currency) => supportedAssets
  .get('assets')
  .find((a) => a.get('currency') === currency)
  .get('symbol');

export const referenceCurrencies = ['eth', 'btc', 'usd'];

export const humanFriendlyWalletType = (type) => {
  if (type === 'lns') return 'Ledger Nano S';
  if (type === 'software') return 'Software Wallet';
  return type;
};

export const isValidPrivateKey = (str) => {
  let filteredStr = str;
  if (str.startsWith('0x')) {
    filteredStr = str.substr(2);
  }
  if (filteredStr.match('-?[0-9a-fA-F]+') && filteredStr.length === 64) return true;
  return false;
};

export function deriveAddresses({ publicKey, chainCode, count }) {
  const pathBase = 'm';
  const hdk = new HDKey();
  hdk.publicKey = new Buffer(publicKey, 'hex');
  hdk.chainCode = new Buffer(chainCode, 'hex');
  const addresses = [];
  for (let i = 0; i < count; i += 1) {
    const index = i;
    const dkey = hdk.derive(`${pathBase}/${index}`);
    const address = publicToAddress(dkey.publicKey, true).toString('hex');
    addresses.push(address);
  }
  return addresses;
}

// input and output are BigNumber
export const gweiToWei = (gwei) => (gwei.times(new BigNumber('10').pow('9')));

export const gweiToEther = (gwei) => (gwei.times(new BigNumber('10').pow('-9')));

export const IsAddressMatch = (a, b) => a.toLowerCase() === b.toLowerCase();

export const parseBigNumber = (bignumber, decimals) => parseInt(bignumber, 10) / (10 ** decimals);

export const isHardwareWallet = (type) => type === 'lns' || type === 'trezor';

export const prependHexToAddress = (address) => address.startsWith('0x') ? address : `0x${address}`;

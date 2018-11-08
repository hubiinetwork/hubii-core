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
    value: formattedBalances.getIn(['assets', asset, 'value', 'usd']).toString(),
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
  if (type === 'lns') return 'wallet_type_lns';
  if (type === 'trezor') return 'wallet_type_trezor';
  if (type === 'software') return 'wallet_type_software';
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

export function deriveAddresses({ publicKey, chainCode, firstIndex, lastIndex }) {
  const pathBase = 'm';
  const hdk = new HDKey();
  hdk.publicKey = new Buffer(publicKey, 'hex');
  hdk.chainCode = new Buffer(chainCode, 'hex');
  const addresses = [];
  for (let i = firstIndex; i <= lastIndex; i += 1) {
    const index = i;
    const dkey = hdk.derive(`${pathBase}/${index}`);
    const address = publicToAddress(dkey.publicKey, true).toString('hex');
    addresses.push(address);
  }
  return addresses;
}

/**
 * Returns if a hardware wallet is connected
 */
export const isConnected = (wallet, ledgerInfo, trezorInfo) => {
  if
    (
      (wallet.type === 'lns' && ledgerInfo.id === wallet.deviceId) ||
      (wallet.type === 'trezor' && trezorInfo.id === wallet.deviceId)
    ) return true;
  return false;
};

export const walletReady = (walletType, ledgerInfo, trezorInfo) => {
  // check ledger
  if (walletType === 'lns' && !ledgerInfo.get('ethConnected')) {
    return false;
  }
  // check trezor
  if (walletType === 'trezor' && trezorInfo.get('status') !== 'connected') {
    return false;
  }
  return true;
};

// input and output are BigNumber
export const gweiToWei = (gwei) => (gwei.times(new BigNumber('10').pow('9')));

export const gweiToEther = (gwei) => (gwei.times(new BigNumber('10').pow('-9')));

export const isAddressMatch = (a, b) => a.toLowerCase() === b.toLowerCase();

export const parseBigNumber = (bignumber, decimals) => parseInt(bignumber, 10) / (10 ** decimals);

export const isHardwareWallet = (type) => type === 'lns' || type === 'trezor';

export const prependHexToAddress = (address) => address.startsWith('0x') ? address : `0x${address}`;

// Regex credit to the MyCrypto team
// Full length deterministic wallet paths from BIP44
// https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
// normal path length is 4, ledger is the exception at 3

// m / purpose' / coin_type' / account' / change / address_index
//   |          |            |          |        |
//   | constant |   index    |  index   | 0 or 1 |
//   |__________|____________|__________|________|

// whitespace strings are evaluated the same way as nospace strings, except they allow optional spaces between each portion of the string
// ie. "m / 44' / 0' / 0'" is valid, "m / 4 4' / 0' / 0'" is invalid
const dPathRegex = /m\/44'\/[0-9]+'\/[0-9]+('+$|'+(\/[0-1]+$))/;
export const isValidPath = (path) => dPathRegex.test(path);

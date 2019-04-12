import { List, Map } from 'immutable';
import { publicToAddress, toChecksumAddress } from 'ethereumjs-util';
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

/*
 * Trims the amount of decimals on 'amount' so that it is accurate up to 0.01 usd equivilent value
 */
export const trimDecimals = (amount, currency, currencyPrices) => {
  // check to see if this currency is a test token, in which case give it an arbitrary price of $100
  const usdPrice = currencyPrices.usd === '0' ? '100' : currencyPrices.usd;

  // find what 0.01 usd is in the relevant currency. force ratio to be a decimal.
  let ratio = new BigNumber(0.01).dividedBy(usdPrice).toString();
  if (!ratio.includes('.')) ratio += '0.0001';
  const ratioSplitByDot = ratio.split('.');
  const amountSplitByDot = amount.toString().split('.');

  // check to see if the amount was a whole value, in which case just return as there is no need for decimal alteration
  if (amountSplitByDot.length === 1) {
    return amount.toString();
  }

  // otherwise, find how many 0's there are after the decimal place on the ratio + 1, and minus that with the length of the
  // number of digits after the decimal place on the ratio.
  let decimalPlacement = (ratioSplitByDot[1].toString().length - parseFloat(ratioSplitByDot[1]).toString().length) + 1;
  let trimmedAmount = `${amountSplitByDot[0]}.${amountSplitByDot[1].substr(0, decimalPlacement)}`;
  while (new BigNumber(trimmedAmount).eq('0')) {
    decimalPlacement += 1;
    trimmedAmount = `${amountSplitByDot[0]}.${amountSplitByDot[1].substr(0, decimalPlacement)}`;
  }
  return new BigNumber(trimmedAmount).toString(); // remove any trailing 0s and return
};

export const getBreakdown = (balances, supportedAssets) => {
  // convert balances to Map if they're in array form
  let formattedBalances = balances;
  if (balances.get('assets') && List.isList(balances.get('assets'))) {
    const assetsAsObj = balances
        .get('assets')
        .reduce((acc, asset) => acc
          .set(asset.get('currency'), asset)
          .setIn([asset.get('currency'), 'amount'], asset.getIn(['balance']))
        , new Map());
    formattedBalances = balances.set('assets', assetsAsObj);
  }

  const totalFiat = formattedBalances.getIn(['total', 'usd']);

  return formattedBalances.get('assets').keySeq().map((asset) => {
    const amount = formattedBalances.getIn(['assets', asset, 'amount']);
    const usdValue = formattedBalances.getIn(['assets', asset, 'value', 'usd']);
    const percentage = totalFiat.toString() !== '0'
      ? usdValue.div(totalFiat).times(100).toNumber()
      : new BigNumber('0');

    return ({
      label: getCurrencySymbol(supportedAssets, asset),
      value: usdValue.toString(),
      amount: trimDecimals(
        amount,
        asset,
        { usd: usdValue.div(amount).toString() }
      ),
      percentage,
      color: supportedAssets.get('assets').find((a) => a.get('currency') === asset).get('color'),
    });
  }).toJS();
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
  if (type === 'watch') return 'wallet_type_watch';
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
    const checksumAddress = toChecksumAddress(address);
    addresses.push(checksumAddress);
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

// valid gwei number is numbers, optionally followed by a . at most 9 more numbers
export const gweiRegex = new RegExp('^\\d+(\\.\\d{0,9})?$');

// only match whole numbers
export const gasLimitRegex = new RegExp('^\\d+$');

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

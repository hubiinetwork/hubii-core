import nahmii from 'nahmii-sdk';
import { getDefaultProvider } from 'ethers';

// eslint-disable-next-line no-unused-vars
const intFromEnv = (key, def) => {
  const v = process.env[key];
  // if it is integer, parse it
  if (!isNaN(v)) return parseInt(v, 10);
  // otherwise return the default value
  return def;
};
// eslint-disable-next-line no-unused-vars
const boolFromEnv = (key, def) => {
  const v = process.env[key];
  // parse string into bool type
  if (typeof v === 'string') return !(v === '0' || v === 'false');
  // otherwise return the default value
  return def;
};
// eslint-disable-next-line no-unused-vars
const stringFromEnv = (key, def) => process.env[key] || def;

export const REPO = stringFromEnv('PUBLISH_REPO');
export const OWNER = stringFromEnv('PUBLISH_OWNER');
export const ROPSTEN_IDENTITY_SERVICE_SECRET = stringFromEnv('ROPSTEN_IDENTITY_SERVICE_SECRET');
export const MAINNET_IDENTITY_SERVICE_SECRET = stringFromEnv('MAINNET_IDENTITY_SERVICE_SECRET');
export const ROPSTEN_IDENTITY_SERVICE_APPID = stringFromEnv('ROPSTEN_IDENTITY_SERVICE_APPID');
export const MAINNET_IDENTITY_SERVICE_APPID = stringFromEnv('MAINNET_IDENTITY_SERVICE_APPID');

const trimmableWalletApiEndpoint = (endpoint) => (trimmed) => {
  if (trimmed) return endpoint.split('//')[1].split('/')[0]; // trim https:// prefix and / suffix
  return endpoint;
};

const ROPSTEN_URL = 'https://api2.dev.hubii.net/';
const MAINNET_URL = 'https://api.nahmii.io/';

const ROPSTEN_NODE = 'http://geth-ropsten.dev.hubii.net';
const MAINNET_NODE = 'http://ethereum.hubii.com:8545';

export const SUPPORTED_NETWORKS = {
  mainnet: {
    provider: getDefaultProvider('mainnet'),
    nahmiiProvider: new nahmii.NahmiiProvider(
      trimmableWalletApiEndpoint(MAINNET_URL)(true),
      MAINNET_IDENTITY_SERVICE_APPID,
      MAINNET_IDENTITY_SERVICE_SECRET,
      MAINNET_NODE,
      1
    ),
    walletApiEndpoint: trimmableWalletApiEndpoint(MAINNET_URL),
    identityServiceSecret: process.env.NODE_ENV === 'test' ? 'secret' : MAINNET_IDENTITY_SERVICE_SECRET,
    identityServiceAppId: process.env.NODE_ENV === 'test' ? 'appid' : MAINNET_IDENTITY_SERVICE_APPID,
  },
  ropsten: {
    provider: getDefaultProvider('ropsten'),
    nahmiiProvider: new nahmii.NahmiiProvider(
      trimmableWalletApiEndpoint(ROPSTEN_URL)(true),
      ROPSTEN_IDENTITY_SERVICE_APPID,
      ROPSTEN_IDENTITY_SERVICE_SECRET,
      ROPSTEN_NODE,
      3
    ),
    walletApiEndpoint: trimmableWalletApiEndpoint(ROPSTEN_URL),
    identityServiceSecret: process.env.NODE_ENV === 'test' ? 'secret' : ROPSTEN_IDENTITY_SERVICE_SECRET,
    identityServiceAppId: process.env.NODE_ENV === 'test' ? 'appid' : ROPSTEN_IDENTITY_SERVICE_APPID,
  },
};

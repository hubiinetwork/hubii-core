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

const ROPSTEN_API_URL = 'https://api2.dev.hubii.net/';
const MAINNET_API_URL = 'https://api.nahmii.io/';

const ROPSTEN_NODE = 'https://geth-ropsten.dev.hubii.net';
const MAINNET_NODE = 'https://ethereum.hubii.com';

const networks = {
  mainnet: {
    name: 'mainnet',
    provider: getDefaultProvider('mainnet'),
    defaultNahmiiProvider: new nahmii.NahmiiProvider(
      trimmableWalletApiEndpoint(MAINNET_API_URL)(true),
      MAINNET_IDENTITY_SERVICE_APPID,
      MAINNET_IDENTITY_SERVICE_SECRET,
      MAINNET_NODE,
      1
    ),
    apiDomain: trimmableWalletApiEndpoint(MAINNET_API_URL)(true),
    walletApiEndpoint: trimmableWalletApiEndpoint(MAINNET_API_URL),
    identityServiceSecret: process.env.NODE_ENV === 'test' ? 'secret' : MAINNET_IDENTITY_SERVICE_SECRET,
    identityServiceAppId: process.env.NODE_ENV === 'test' ? 'appid' : MAINNET_IDENTITY_SERVICE_APPID,
  },
  ropsten: {
    name: 'ropsten',
    provider: getDefaultProvider('ropsten'),
    defaultNahmiiProvider: new nahmii.NahmiiProvider(
      trimmableWalletApiEndpoint(ROPSTEN_API_URL)(true),
      ROPSTEN_IDENTITY_SERVICE_APPID,
      ROPSTEN_IDENTITY_SERVICE_SECRET,
      ROPSTEN_NODE,
      3
    ),
    apiDomain: trimmableWalletApiEndpoint(ROPSTEN_API_URL)(true),
    walletApiEndpoint: trimmableWalletApiEndpoint(ROPSTEN_API_URL),
    identityServiceSecret: process.env.NODE_ENV === 'test' ? 'secret' : ROPSTEN_IDENTITY_SERVICE_SECRET,
    identityServiceAppId: process.env.NODE_ENV === 'test' ? 'appid' : ROPSTEN_IDENTITY_SERVICE_APPID,
  },
};

if (process.env.MINI_CLUSTER_HOST) {
  Object.assign(networks.ropsten, {
    apiDomain: process.env.MINI_CLUSTER_HOST,
    walletApiEndpoint: trimmableWalletApiEndpoint(`https://${process.env.MINI_CLUSTER_HOST}/`),
    identityServiceAppId: stringFromEnv('MINI_CLUSTER_IDENTITY_SERVICE_APPID'),
    identityServiceSecret: stringFromEnv('MINI_CLUSTER_IDENTITY_SERVICE_SECRET'),
  });

  networks.ropsten.nahmiiProvider = new nahmii.NahmiiProvider(
    process.env.MINI_CLUSTER_HOST,
    networks.ropsten.identityServiceAppId,
    networks.ropsten.identityServiceSecret,
    `https://${process.env.MINI_CLUSTER_HOST}/ganache`,
    3
  );
}

export const SUPPORTED_NETWORKS = networks;

import { providers } from 'ethers';

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
export const HOMESTEAD_IDENTITY_SERVICE_SECRET = stringFromEnv('HOMESTEAD_IDENTITY_SERVICE_SECRET');
export const ROPSTEN_IDENTITY_SERVICE_APPID = stringFromEnv('ROPSTEN_IDENTITY_SERVICE_APPID');
export const HOMESTEAD_IDENTITY_SERVICE_APPID = stringFromEnv('HOMESTEAD_IDENTITY_SERVICE_APPID');

const trimmableWalletApiEndpoint = (endpoint) => (trimmed) => {
  if (trimmed) return endpoint.split('//')[1].split('/')[0]; // trim https:// prefix and / suffix
  return endpoint;
};

export const SUPPORTED_NETWORKS = {
  homestead: {
    provider: providers.getDefaultProvider('homestead'),
    walletApiEndpoint: trimmableWalletApiEndpoint('https://api2.hubii.com/'),
    identityServiceSecret: process.env.NODE_ENV === 'test' ? 'secret' : HOMESTEAD_IDENTITY_SERVICE_SECRET,
    identityServiceAppId: process.env.NODE_ENV === 'test' ? 'appid' : HOMESTEAD_IDENTITY_SERVICE_APPID,
  },
  ropsten: {
    provider: providers.getDefaultProvider('ropsten'),
    walletApiEndpoint: trimmableWalletApiEndpoint('https://api2.dev.hubii.net/'),
    identityServiceSecret: process.env.NODE_ENV === 'test' ? 'secret' : ROPSTEN_IDENTITY_SERVICE_SECRET,
    identityServiceAppId: process.env.NODE_ENV === 'test' ? 'appid' : ROPSTEN_IDENTITY_SERVICE_APPID,
  },
};

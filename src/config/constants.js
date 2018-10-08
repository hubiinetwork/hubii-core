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

export const SUPPORTED_NETWORKS = {
  homestead: {
    provider: providers.getDefaultProvider('homestead'),
    walletApiEndpoint: 'https://api2.hubii.com/',
    identityServiceSecret: HOMESTEAD_IDENTITY_SERVICE_SECRET,
    identityServiceAppId: HOMESTEAD_IDENTITY_SERVICE_APPID,

  },
  ropsten: {
    provider: providers.getDefaultProvider('ropsten'),
    walletApiEndpoint: 'https://api2.dev.hubii.net/',
    identityServiceSecret: ROPSTEN_IDENTITY_SERVICE_SECRET,
    identityServiceAppId: ROPSTEN_IDENTITY_SERVICE_APPID,
  },
};

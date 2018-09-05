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

export const REPO = stringFromEnv('npm_package_build_publish_0_repo');
export const OWNER = stringFromEnv('npm_package_build_publish_0_owner');
export const SUPPORTED_NETWORKS = {
  homestead: {
    provider: providers.getDefaultProvider('homestead'),
    walletApiEndpoint: 'https://api2.hubii.com/',
  },
  ropsten: {
    provider: providers.getDefaultProvider('ropsten'),
    walletApiEndpoint: 'https://api2.dev.hubii.net/',
  },
};

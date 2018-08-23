// eslint-disable-next-line no-unused-vars
const intFromEnv = (key, def) => {
  const v = process.env[key];
  if (!isNaN(v)) return parseInt(v, 10);
  return def;
};
// eslint-disable-next-line no-unused-vars
const boolFromEnv = (key, def) => {
  const v = process.env[key];
  if (typeof v === 'string') return !(v === '0' || v === 'false');
  return def;
};
const stringFromEnv = (key, def) => process.env[key] || def;

export const WALLET_API = stringFromEnv('WALLET_API', 'https://api2.dev.hubii.net/');

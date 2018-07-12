import isElectron from '../isElectron';

export default (error) => {
  if (error.id === 'ListenTimeout') {
    return 'Ledger could not be detected, please check your connection and ensure you have entered your PIN.';
  } else if (error.name === 'TransportStatusError') {
    return 'Ledger connected but does not appear to have the Ethereum app open. Please download the Ethereum app from the Ledger Manager and open it on your device.';
  } else if (error.name === 'TransportError') {
    return `Ledger connected but does not appear to have 'Browser support' set to ${isElectron ? '\'No\'' : '\'Yes\''}, please ${isElectron ? 'disable' : 'enable'} browser support in the Ethereum app settings.`;
  }
  return `Ledger could not be detected, please ensure browser support is set to ${isElectron ? '\'No\'' : '\'Yes\''}`;
};

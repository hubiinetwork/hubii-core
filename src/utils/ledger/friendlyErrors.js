import isElectron from '../isElectron';

export default (error) => {
  if (error.message === 'Disconnected') return disconnectedErrorMsg;
  if (error.name === 'TransportStatusError') return ethAppNotOpenErrorMsg;
  if (error.name === 'TransportError') return browserSupportErrorMsg;
  if (error.message === 'Failed to open connection with USB port') return error.message;
  return `Unknown error occured: ${error}`;
};

export const disconnectedErrorMsg = 'Ledger could not be detected, please check your connection and ensure you have entered your PIN.';
export const ethAppNotOpenErrorMsg = 'Ledger connected but does not appear to have the Ethereum app open. Please download the Ethereum app from the Ledger Manager and open it on your device.';
export const browserSupportErrorMsg = `Ledger connected but does not appear to have 'Browser support' set to ${isElectron ? '\'No\'' : '\'Yes\''}, please ${isElectron ? 'disable' : 'enable'} browser support in the Ethereum app settings.`;

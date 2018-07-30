import isElectron from '../isElectron';

export default (error) => {
  if (error.message === 'Disconnected') return disconnectedErrorMsg;
  if (error.message && error.message.includes('Condition of use not satisfied')) return cancelTxErrorMsg;
  if (error.message && error.message.includes('Ledger device: Invalid data received')) return contractDataErrorMsg;
  if (error.name === 'TransportStatusError') return ethAppNotOpenErrorMsg;
  if (error.name === 'TransportError') return browserSupportErrorMsg;
  if (error.message === 'NoSupport') return noTransportErrorMsg;
  if (error.message && error.message.includes('cannot open device with path')) return disconnectedErrorMsg;
  return `Unknown error occured: ${error}`;
};

export const noTransportErrorMsg = 'Failed to open connection with USB port';
export const ethAppNotOpenErrorMsg = 'Ledger connected but does not appear to have the Ethereum app open. Please download the Ethereum app from the Ledger Manager and open it on your device.';
export const browserSupportErrorMsg = `Ledger connected but does not appear to have 'Browser support' set to ${isElectron ? '\'No\'' : '\'Yes\''}, please ${isElectron ? 'disable' : 'enable'} browser support in the Ethereum app settings.`;
export const disconnectedErrorMsg = `Ledger could not be detected, please check your connection and ensure you have entered your PIN. Also check if ${browserSupportErrorMsg}`;
export const cancelTxErrorMsg = 'Transaction Cancelled';
export const contractDataErrorMsg = 'Failed to transfer token. Please make sure \'Contract data\' is set to yes on your Ledger device.';

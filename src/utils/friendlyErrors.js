import isElectron from './isElectron';

// ledger
export const noTransportErrorMsg = 'Failed to open connection with USB port';
export const ethAppNotOpenErrorMsg = 'Ledger connected but does not appear to have the Ethereum app open. Please download the Ethereum app from the Ledger Manager and open it on your device.';
export const browserSupportErrorMsg = `Ledger connected but does not appear to have 'Browser support' set to ${isElectron ? '\'No\'' : '\'Yes\''}, please ${isElectron ? 'disable' : 'enable'} browser support in the Ethereum app settings.`;
export const disconnectedErrorMsg = `Ledger could not be detected, please check your connection and ensure you have entered your PIN. Also check if ${browserSupportErrorMsg}`;
export const cancelTxErrorMsg = 'Transaction Cancelled';
export const contractDataErrorMsg = 'Failed to transfer token. Please make sure \'Contract data\' is set to yes on your Ledger device.';

// trezor
export const trezorDisconnectedErrorMsg = 'Trezor is not connected.';
export const trezorPinInvalidErrorMsg = 'Trezor PIN code is invalid.';
export const trezorPassphraseMismatchErrorMsg = 'Please reconnect your Trezor device, and make sure you provided the correct passphrase for this wallet.';
export const trezorCancelledErrorMsg = 'Denied by Trezor';

function trezorErrorMsg(error) {
  let msg;
  if (error.message === 'Disconnected') {
    msg = trezorDisconnectedErrorMsg;
  }
  if (error.message === 'PIN invalid') {
    msg = trezorPinInvalidErrorMsg;
  }
  if (error.message === 'PASSPHRASE_MISMATCH') {
    msg = trezorPassphraseMismatchErrorMsg;
  }
  if (error.message === 'Inconsistent state') {
    msg = trezorPassphraseMismatchErrorMsg;
  }
  if (error.message === 'TREZOR_CANCELED') {
    msg = trezorCancelledErrorMsg;
  }
  if (error.message === 'PIN cancelled') {
    msg = trezorCancelledErrorMsg;
  }
  return msg;
}

function ledgerErrorMsg(error) {
  let msg;
  if (error.message === 'Disconnected') msg = disconnectedErrorMsg;
  if (error.message && error.message.includes('Condition of use not satisfied')) msg = cancelTxErrorMsg;
  if (error.message && error.message.includes('Ledger device: Invalid data received')) msg = contractDataErrorMsg;
  if (error.message && error.message.includes('Incorrect length')) msg = ethAppNotOpenErrorMsg;
  if (error.message && error.message.includes('Invalid channel')) msg = browserSupportErrorMsg;
  if (error.message && error.message.includes('cannot open device with path')) msg = disconnectedErrorMsg;
  return msg;
}

export default (error, type) => {
  let msg;
  if (!type || type === 'lns') {
    msg = ledgerErrorMsg(error);
  }
  if (type === 'trezor') {
    msg = trezorErrorMsg(error);
  }
  if (msg) {
    return msg;
  }
  return `Unknown error occured: ${error}`;
};

// ledger
export const noTransportErrorMsg = 'Failed to open connection with USB port';
export const ethAppNotOpenErrorMsg = 'ledger_connected_not_eth_open_error';
export const browserSupportErrorMsg = 'ledger_connected_not_browser_support_error';
export const disconnectedErrorMsg = 'ledger_not_detected_error';
export const cancelTxErrorMsg = 'ledger_transaction_cancelled_error';
export const contractDataErrorMsg = 'ledger_contract_transaction_data_error';

// trezor
export const trezorDisconnectedErrorMsg = 'trezor_not_connected_error';
export const trezorPinInvalidErrorMsg = 'trezor_invalid_pin_error';
export const trezorPassphraseMismatchErrorMsg = 'trezor_invalid_passphrase_error';
export const trezorCancelledErrorMsg = 'trezor_denied_error';

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

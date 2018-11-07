/*
 *
 * LedgerHoc actions
 *
 */

import { CREATE_WALLET_SUCCESS } from 'containers/WalletHoc/constants';
import getFriendlyError from 'utils/friendlyErrors';

import {
  INIT_LEDGER,
  FETCH_LEDGER_ADDRESSES,
  FETCHED_LEDGER_ADDRESS,
  LEDGER_CONNECTED,
  LEDGER_DISCONNECTED,
  LEDGER_ETH_CONNECTED,
  LEDGER_ETH_DISCONNECTED,
  LEDGER_ERROR,
  LEDGER_CONFIRM_TX_ON_DEVICE,
  LEDGER_CONFIRM_TX_ON_DEVICE_DONE,
} from './constants';


export function initLedger() {
  return {
    type: INIT_LEDGER,
  };
}

export function fetchLedgerAddresses(pathTemplate, firstIndex, lastIndex, hardened) {
  return {
    type: FETCH_LEDGER_ADDRESSES,
    pathTemplate,
    firstIndex,
    lastIndex,
    hardened,
  };
}

export function fetchedLedgerAddress(derivationPath, address) {
  return {
    type: FETCHED_LEDGER_ADDRESS,
    derivationPath,
    address,
  };
}

export function saveLedgerAddress(name, derivationPath, deviceId, address) {
  const newWallet = {
    deviceId,
    address,
    type: 'lns',
    name,
    derivationPath,
  };
  return {
    type: CREATE_WALLET_SUCCESS,
    newWallet,
  };
}

export function ledgerConnected(descriptor) {
  return {
    type: LEDGER_CONNECTED,
    descriptor,
  };
}

export function ledgerDisconnected(descriptor) {
  return {
    type: LEDGER_DISCONNECTED,
    descriptor,
  };
}

export function ledgerEthAppConnected(descriptor, id) {
  return {
    type: LEDGER_ETH_CONNECTED,
    descriptor,
    id,
  };
}

export function ledgerEthAppDisconnected() {
  return {
    type: LEDGER_ETH_DISCONNECTED,
  };
}

export function ledgerError(rawError) {
  const friendlyError = getFriendlyError(rawError);
  return {
    type: LEDGER_ERROR,
    error: friendlyError,
  };
}

export function ledgerConfirmTxOnDevice() {
  return {
    type: LEDGER_CONFIRM_TX_ON_DEVICE,
  };
}

export function ledgerConfirmTxOnDeviceDone() {
  return {
    type: LEDGER_CONFIRM_TX_ON_DEVICE_DONE,
  };
}

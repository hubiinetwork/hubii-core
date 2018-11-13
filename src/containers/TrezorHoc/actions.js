/*
 *
 * TrezorHoc actions
 *
 */

import getFriendlyError from 'utils/friendlyErrors';

import {
  FETCH_TREZOR_ADDRESSES,
  FETCHED_TREZOR_ADDRESS,
  INIT_TREZOR,
  TREZOR_ERROR,
  TREZOR_CONNECTED,
  TREZOR_DISCONNECTED,
  TREZOR_CONFIRM_TX_ON_DEVICE,
  TREZOR_CONFIRM_TX_ON_DEVICE_DONE,
} from './constants';


export function initTrezor() {
  return {
    type: INIT_TREZOR,
  };
}

export function trezorConnected(deviceId) {
  return {
    type: TREZOR_CONNECTED,
    deviceId,
  };
}

export function trezorDisconnected(deviceId) {
  return {
    type: TREZOR_DISCONNECTED,
    deviceId,
  };
}

export function fetchTrezorAddresses(pathTemplate, firstIndex, lastIndex) {
  return {
    type: FETCH_TREZOR_ADDRESSES,
    pathTemplate,
    firstIndex,
    lastIndex,
  };
}

export function fetchedTrezorAddress(derivationPath, address) {
  return {
    type: FETCHED_TREZOR_ADDRESS,
    derivationPath,
    address,
  };
}

export function trezorError(rawError) {
  const friendlyError = getFriendlyError(rawError, 'trezor');
  return {
    type: TREZOR_ERROR,
    error: friendlyError,
  };
}

export function trezorConfirmTxOnDevice() {
  return {
    type: TREZOR_CONFIRM_TX_ON_DEVICE,
  };
}

export function trezorConfirmTxOnDeviceDone() {
  return {
    type: TREZOR_CONFIRM_TX_ON_DEVICE_DONE,
  };
}

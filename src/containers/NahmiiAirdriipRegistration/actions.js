/*
 *
 * NahmiiAirdriipRegistration actions
 *
 */

import {
  CHANGE_STAGE,
  REGISTER,
  CHANGE_SELECTED_CORE_WALLET,
  CHANGE_MANUAL_ADDRESS,
  CHANGE_MANUAL_SIGNED_MESSAGE,
  REGISTRATION_SUCCESS,
  REGISTRATION_FAILED,
} from './constants';

export function changeStage(stage) {
  return {
    type: CHANGE_STAGE,
    stage,
  };
}

export function changeSelectedCoreWallet(wallet) {
  return {
    type: CHANGE_SELECTED_CORE_WALLET,
    wallet,
  };
}

export function changeManualAddress(address) {
  return {
    type: CHANGE_MANUAL_ADDRESS,
    address,
  };
}

export function changeManualSignedMessage(signedMessage) {
  return {
    type: CHANGE_MANUAL_SIGNED_MESSAGE,
    signedMessage,
  };
}

export function register() {
  return {
    type: REGISTER,
  };
}

export function registerationSuccess() {
  return {
    type: REGISTRATION_SUCCESS,
  };
}

export function registerationFailed(error) {
  return {
    type: REGISTRATION_FAILED,
    error,
  };
}

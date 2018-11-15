/*
 *
 * NahmiiAirdriipRegistration actions
 *
 */

import {
  CHANGE_STAGE,
  REGISTER,
  CHANGE_MANUAL_ADDRESS,
  CHANGE_MANUAL_SIGNED_MESSAGE,
  REGISTRATION_SUCCESS,
  REGISTRATION_FAILED,
  CHECK_ADDRESS_REGISTRATION_SUCCESS,
  CHECK_ADDRESS_REGISTRATION_FAILED,
} from './constants';

export function checkAddressRegistrationSuccess(address, status) {
  return {
    type: CHECK_ADDRESS_REGISTRATION_SUCCESS,
    address,
    status,
  };
}

export function checkAddressRegistrationFailed(address, error) {
  return {
    type: CHECK_ADDRESS_REGISTRATION_FAILED,
    address,
    error,
  };
}

export function changeStage(stage) {
  return {
    type: CHANGE_STAGE,
    stage,
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

export function registerationSuccess(address) {
  return {
    type: REGISTRATION_SUCCESS,
    address,
  };
}

export function registerationFailed(error) {
  return {
    type: REGISTRATION_FAILED,
    error,
  };
}

/*
 *
 * DepositPage actions
 *
 */

import {
  LOAD_DEPOSIT_INFO,
  LOAD_DEPOSIT_INFO_SUCCESS,
  LOAD_DEPOSIT_INFO_FAILURE,
} from './constants';

export function loadDepositInfo() {
  return {
    type: LOAD_DEPOSIT_INFO,
  };
}

export function depositInfoLoaded(depositInfo) {
  return {
    type: LOAD_DEPOSIT_INFO_SUCCESS,
    depositInfo,
  };
}

export function depositInfoLoadingError(error) {
  return {
    type: LOAD_DEPOSIT_INFO_FAILURE,
    error,
  };
}

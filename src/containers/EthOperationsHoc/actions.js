/*
 *
 * EthOperationsHoc actions
 *
 */

import {
  LOAD_BLOCK_HEIGHT,
  LOAD_BLOCK_HEIGHT_SUCCESS,
  LOAD_BLOCK_HEIGHT_ERROR,
} from './constants';

export function loadBlockHeight() {
  return {
    type: LOAD_BLOCK_HEIGHT,
  };
}

export function loadBlockHeightSuccess(blockHeight) {
  return {
    type: LOAD_BLOCK_HEIGHT_SUCCESS,
    blockHeight,
  };
}
export function loadBlockHeightError(error) {
  return {
    type: LOAD_BLOCK_HEIGHT_ERROR,
    error,
  };
}

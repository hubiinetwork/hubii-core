/*
 *
 * EthOperationsHoc actions
 *
 */

import {
  LOAD_BLOCK_HEIGHT,
  LOAD_BLOCK_HEIGHT_SUCCESS,
  LOAD_BLOCK_HEIGHT_ERROR,
  LOAD_GAS_STATISTICS,
  LOAD_GAS_STATISTICS_SUCCESS,
  LOAD_GAS_STATISTICS_ERROR,
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
export function loadGasStatistics() {
  return {
    type: LOAD_GAS_STATISTICS,
  };
}
export function loadGasStatisticsSuccess(gasStatistics) {
  return {
    type: LOAD_GAS_STATISTICS_SUCCESS,
    gasStatistics,
  };
}
export function loadGasStatisticsError(error) {
  return {
    type: LOAD_GAS_STATISTICS_ERROR,
    error,
  };
}

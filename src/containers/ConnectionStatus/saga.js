import { delay } from 'redux-saga';
import { takeEvery, put, race, take, call } from 'redux-saga/effects';

import {
  LOAD_BLOCK_HEIGHT_ERROR,
  LOAD_GAS_STATISTICS_ERROR,
  LOAD_BLOCK_HEIGHT_SUCCESS,
  LOAD_GAS_STATISTICS_SUCCESS,
} from 'containers/EthOperationsHoc/constants';
import {
  LOAD_NAHMII_BALANCES_ERROR,
  LOAD_NAHMII_BALANCES_SUCCESS,
  LOAD_NAHMII_STAGED_BALANCES_ERROR,
  LOAD_NAHMII_STAGED_BALANCES_SUCCESS,
  LOAD_NAHMII_STAGING_BALANCES_ERROR,
  LOAD_NAHMII_STAGING_BALANCES_SUCCESS,
  LOAD_NAHMII_RECEIPTS_ERROR,
  LOAD_NAHMII_RECEIPTS_SUCCESS,
} from 'containers/NahmiiHoc/constants';
import {
  LOAD_WALLET_BALANCES_ERROR,
  LOAD_SUPPORTED_TOKENS_ERROR,
  LOAD_PRICES_ERROR,
  LOAD_TRANSACTIONS_ERROR,
  LOAD_WALLET_BALANCES_SUCCESS,
  LOAD_SUPPORTED_TOKENS_SUCCESS,
  LOAD_PRICES_SUCCESS,
  LOAD_TRANSACTIONS_SUCCESS,
} from 'containers/HubiiApiHoc/constants';

import { networkFailure, networkReconnected } from './actions';

export const errorSuccessPairs = {
  [LOAD_BLOCK_HEIGHT_ERROR]: LOAD_BLOCK_HEIGHT_SUCCESS,
  [LOAD_GAS_STATISTICS_ERROR]: LOAD_GAS_STATISTICS_SUCCESS,
  [LOAD_NAHMII_BALANCES_ERROR]: LOAD_NAHMII_BALANCES_SUCCESS,
  [LOAD_NAHMII_STAGED_BALANCES_ERROR]: LOAD_NAHMII_STAGED_BALANCES_SUCCESS,
  [LOAD_NAHMII_STAGING_BALANCES_ERROR]: LOAD_NAHMII_STAGING_BALANCES_SUCCESS,
  [LOAD_NAHMII_RECEIPTS_ERROR]: LOAD_NAHMII_RECEIPTS_SUCCESS,
  [LOAD_WALLET_BALANCES_ERROR]: LOAD_WALLET_BALANCES_SUCCESS,
  [LOAD_TRANSACTIONS_ERROR]: LOAD_TRANSACTIONS_SUCCESS,
  [LOAD_SUPPORTED_TOKENS_ERROR]: LOAD_SUPPORTED_TOKENS_SUCCESS,
  [LOAD_PRICES_ERROR]: LOAD_PRICES_SUCCESS,
};

export function* handleError({ type }) {
  const successType = errorSuccessPairs[type];
  const { timeout } = yield race({
    timeout: call(delay, 5000),
    success: take(successType),
  });
  if (!timeout) return;
  yield put(networkFailure(type));
  yield take(successType);
  yield put(networkReconnected(type));
}

export default function* root() {
  yield takeEvery([...Object.keys(errorSuccessPairs)], handleError);
}

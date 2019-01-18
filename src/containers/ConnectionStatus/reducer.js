/*
 *
 * ConnectionStatus reducer
 *
 */

import { fromJS, Set } from 'immutable';
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

const initialState = fromJS({
  errors: new Set(),
});

function connectionStatusReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_TRANSACTIONS_ERROR:
      return state.updateIn(['errors'], (errors) => errors.add(LOAD_TRANSACTIONS_ERROR));
    case LOAD_TRANSACTIONS_SUCCESS:
      return state.updateIn(['errors'], (errors) => errors.remove(LOAD_TRANSACTIONS_ERROR));

    case LOAD_PRICES_ERROR:
      return state.updateIn(['errors'], (errors) => errors.add(LOAD_PRICES_ERROR));
    case LOAD_PRICES_SUCCESS:
      return state.updateIn(['errors'], (errors) => errors.remove(LOAD_PRICES_ERROR));

    case LOAD_SUPPORTED_TOKENS_ERROR:
      return state.updateIn(['errors'], (errors) => errors.add(LOAD_SUPPORTED_TOKENS_ERROR));
    case LOAD_SUPPORTED_TOKENS_SUCCESS:
      return state.updateIn(['errors'], (errors) => errors.remove(LOAD_SUPPORTED_TOKENS_ERROR));

    case LOAD_WALLET_BALANCES_ERROR:
      return state.updateIn(['errors'], (errors) => errors.add(LOAD_WALLET_BALANCES_ERROR));
    case LOAD_WALLET_BALANCES_SUCCESS:
      return state.updateIn(['errors'], (errors) => errors.remove(LOAD_WALLET_BALANCES_ERROR));

    case LOAD_NAHMII_RECEIPTS_ERROR:
      return state.updateIn(['errors'], (errors) => errors.add(LOAD_NAHMII_RECEIPTS_ERROR));
    case LOAD_NAHMII_RECEIPTS_SUCCESS:
      return state.updateIn(['errors'], (errors) => errors.remove(LOAD_NAHMII_RECEIPTS_ERROR));

    case LOAD_NAHMII_STAGING_BALANCES_ERROR:
      return state.updateIn(['errors'], (errors) => errors.add(LOAD_NAHMII_STAGING_BALANCES_ERROR));
    case LOAD_NAHMII_STAGING_BALANCES_SUCCESS:
      return state.updateIn(['errors'], (errors) => errors.remove(LOAD_NAHMII_STAGING_BALANCES_ERROR));

    case LOAD_NAHMII_BALANCES_ERROR:
      return state.updateIn(['errors'], (errors) => errors.add(LOAD_NAHMII_BALANCES_ERROR));
    case LOAD_NAHMII_BALANCES_SUCCESS:
      return state.updateIn(['errors'], (errors) => errors.remove(LOAD_NAHMII_BALANCES_ERROR));

    case LOAD_GAS_STATISTICS_ERROR:
      return state.updateIn(['errors'], (errors) => errors.add(LOAD_GAS_STATISTICS_ERROR));
    case LOAD_GAS_STATISTICS_SUCCESS:
      return state.updateIn(['errors'], (errors) => errors.remove(LOAD_GAS_STATISTICS_ERROR));

    case LOAD_BLOCK_HEIGHT_ERROR:
      return state.updateIn(['errors'], (errors) => errors.add(LOAD_BLOCK_HEIGHT_ERROR));
    case LOAD_BLOCK_HEIGHT_SUCCESS:
      return state.updateIn(['errors'], (errors) => errors.remove(LOAD_BLOCK_HEIGHT_ERROR));

    case LOAD_NAHMII_STAGED_BALANCES_ERROR:
      return state.updateIn(['errors'], (errors) => errors.add(LOAD_NAHMII_STAGED_BALANCES_ERROR));
    case LOAD_NAHMII_STAGED_BALANCES_SUCCESS:
      return state.updateIn(['errors'], (errors) => errors.remove(LOAD_NAHMII_STAGED_BALANCES_ERROR));
    default:
      return state;
  }
}

export default connectionStatusReducer;

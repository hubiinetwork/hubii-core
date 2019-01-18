
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

import connectionStatusReducer from '../reducer';

const initialState = fromJS({
  errors: new Set(),
});

describe('connectionStatusReducer', () => {
  it('returns the initial state', () => {
    expect(connectionStatusReducer(undefined, {})).toEqual(initialState);
  });

  it('handles LOAD_WALLET_BALANCES_ERROR correctly', () => {
    const mockState = initialState;
    const expected = mockState.updateIn(['errors'], (errors) => errors.add(LOAD_WALLET_BALANCES_ERROR));
    expect(connectionStatusReducer(mockState, { type: LOAD_WALLET_BALANCES_ERROR })).toEqual(expected);
  });
  it('handles LOAD_WALLET_BALANCES_SUCCESS correctly', () => {
    const mockState = initialState;
    const expected = mockState.updateIn(['errors'], (errors) => errors.remove(LOAD_WALLET_BALANCES_ERROR));
    expect(connectionStatusReducer(mockState, { type: LOAD_WALLET_BALANCES_SUCCESS })).toEqual(expected);
  });

  it('handles LOAD_NAHMII_RECEIPTS_ERROR correctly', () => {
    const mockState = initialState;
    const expected = mockState.updateIn(['errors'], (errors) => errors.add(LOAD_NAHMII_RECEIPTS_ERROR));
    expect(connectionStatusReducer(mockState, { type: LOAD_NAHMII_RECEIPTS_ERROR })).toEqual(expected);
  });
  it('handles LOAD_NAHMII_RECEIPTS_SUCCESS correctly', () => {
    const mockState = initialState.updateIn(['errors'], (errors) => errors.add(LOAD_NAHMII_RECEIPTS_ERROR));
    const expected = initialState;
    expect(connectionStatusReducer(mockState, { type: LOAD_NAHMII_RECEIPTS_SUCCESS })).toEqual(expected);
  });

  it('handles LOAD_NAHMII_STAGING_BALANCES_ERROR correctly', () => {
    const mockState = initialState;
    const expected = mockState.updateIn(['errors'], (errors) => errors.add(LOAD_NAHMII_STAGING_BALANCES_ERROR));
    expect(connectionStatusReducer(mockState, { type: LOAD_NAHMII_STAGING_BALANCES_ERROR })).toEqual(expected);
  });
  it('handles LOAD_NAHMII_STAGING_BALANCES_SUCCESS correctly', () => {
    const mockState = initialState.updateIn(['errors'], (errors) => errors.add(LOAD_NAHMII_STAGING_BALANCES_ERROR));
    const expected = initialState;
    expect(connectionStatusReducer(mockState, { type: LOAD_NAHMII_STAGING_BALANCES_SUCCESS })).toEqual(expected);
  });

  it('handles LOAD_NAHMII_STAGED_BALANCES_ERROR correctly', () => {
    const mockState = initialState;
    const expected = mockState.updateIn(['errors'], (errors) => errors.add(LOAD_NAHMII_STAGED_BALANCES_ERROR));
    expect(connectionStatusReducer(mockState, { type: LOAD_NAHMII_STAGED_BALANCES_ERROR })).toEqual(expected);
  });
  it('handles LOAD_NAHMII_STAGED_BALANCES_SUCCESS correctly', () => {
    const mockState = initialState.updateIn(['errors'], (errors) => errors.add(LOAD_NAHMII_STAGED_BALANCES_ERROR));
    const expected = initialState;
    expect(connectionStatusReducer(mockState, { type: LOAD_NAHMII_STAGED_BALANCES_SUCCESS })).toEqual(expected);
  });

  it('handles LOAD_NAHMII_BALANCES_ERROR correctly', () => {
    const mockState = initialState;
    const expected = mockState.updateIn(['errors'], (errors) => errors.add(LOAD_NAHMII_BALANCES_ERROR));
    expect(connectionStatusReducer(mockState, { type: LOAD_NAHMII_BALANCES_ERROR })).toEqual(expected);
  });
  it('handles LOAD_NAHMII_BALANCES_SUCCESS correctly', () => {
    const mockState = initialState.updateIn(['errors'], (errors) => errors.add(LOAD_NAHMII_BALANCES_ERROR));
    const expected = initialState;
    expect(connectionStatusReducer(mockState, { type: LOAD_NAHMII_BALANCES_SUCCESS })).toEqual(expected);
  });

  it('handles LOAD_GAS_STATISTICS_ERROR correctly', () => {
    const mockState = initialState;
    const expected = mockState.updateIn(['errors'], (errors) => errors.add(LOAD_GAS_STATISTICS_ERROR));
    expect(connectionStatusReducer(mockState, { type: LOAD_GAS_STATISTICS_ERROR })).toEqual(expected);
  });
  it('handles LOAD_GAS_STATISTICS_SUCCESS correctly', () => {
    const mockState = initialState.updateIn(['errors'], (errors) => errors.add(LOAD_GAS_STATISTICS_ERROR));
    const expected = initialState;
    expect(connectionStatusReducer(mockState, { type: LOAD_GAS_STATISTICS_SUCCESS })).toEqual(expected);
  });

  it('handles LOAD_BLOCK_HEIGHT_ERROR correctly', () => {
    const mockState = initialState;
    const expected = mockState.updateIn(['errors'], (errors) => errors.add(LOAD_BLOCK_HEIGHT_ERROR));
    expect(connectionStatusReducer(mockState, { type: LOAD_BLOCK_HEIGHT_ERROR })).toEqual(expected);
  });
  it('handles LOAD_BLOCK_HEIGHT_SUCCESS correctly', () => {
    const mockState = initialState.updateIn(['errors'], (errors) => errors.add(LOAD_BLOCK_HEIGHT_ERROR));
    const expected = initialState;
    expect(connectionStatusReducer(mockState, { type: LOAD_BLOCK_HEIGHT_SUCCESS })).toEqual(expected);
  });

  it('handles LOAD_TRANSACTIONS_ERROR correctly', () => {
    const mockState = initialState;
    const expected = mockState.updateIn(['errors'], (errors) => errors.add(LOAD_TRANSACTIONS_ERROR));
    expect(connectionStatusReducer(mockState, { type: LOAD_TRANSACTIONS_ERROR })).toEqual(expected);
  });
  it('handles LOAD_TRANSACTIONS_SUCCESS correctly', () => {
    const mockState = initialState.updateIn(['errors'], (errors) => errors.add(LOAD_TRANSACTIONS_ERROR));
    const expected = initialState;
    expect(connectionStatusReducer(mockState, { type: LOAD_TRANSACTIONS_SUCCESS })).toEqual(expected);
  });

  it('handles LOAD_PRICES_ERROR correctly', () => {
    const mockState = initialState;
    const expected = mockState.updateIn(['errors'], (errors) => errors.add(LOAD_PRICES_ERROR));
    expect(connectionStatusReducer(mockState, { type: LOAD_PRICES_ERROR })).toEqual(expected);
  });
  it('handles LOAD_PRICES_SUCCESS correctly', () => {
    const mockState = initialState.updateIn(['errors'], (errors) => errors.add(LOAD_PRICES_ERROR));
    const expected = initialState;
    expect(connectionStatusReducer(mockState, { type: LOAD_PRICES_SUCCESS })).toEqual(expected);
  });

  it('handles LOAD_SUPPORTED_TOKENS_ERROR correctly', () => {
    const mockState = initialState;
    const expected = mockState.updateIn(['errors'], (errors) => errors.add(LOAD_SUPPORTED_TOKENS_ERROR));
    expect(connectionStatusReducer(mockState, { type: LOAD_SUPPORTED_TOKENS_ERROR })).toEqual(expected);
  });
  it('handles LOAD_SUPPORTED_TOKENS_SUCCESS correctly', () => {
    const mockState = initialState.updateIn(['errors'], (errors) => errors.add(LOAD_SUPPORTED_TOKENS_ERROR));
    const expected = initialState;
    expect(connectionStatusReducer(mockState, { type: LOAD_SUPPORTED_TOKENS_SUCCESS })).toEqual(expected);
  });
});

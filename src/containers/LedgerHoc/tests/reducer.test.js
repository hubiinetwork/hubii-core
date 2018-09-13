import { fromJS } from 'immutable';
import { disconnectedErrorMsg } from 'utils/friendlyErrors';

import {
  ledgerEthAppConnected,
  ledgerConfirmTxOnDevice,
  ledgerConfirmTxOnDeviceDone,
  ledgerEthAppDisconnected,
  ledgerError,
  fetchedLedgerAddress,
  ledgerConnected,
} from '../actions';

import ledgerHocReducer from '../reducer';

describe('ledgerHocReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      status: 'disconnected',
      ethConnected: false,
      connected: false,
      addresses: {},
      id: null,
      confTxOnDevice: false,
      error: disconnectedErrorMsg,
    });
  });

  it('returns the initial state', () => {
    expect(ledgerHocReducer(undefined, {})).toEqual(state);
  });

  it('should handle LEDGER_ETH_CONNECTED action correctly', () => {
    const id = '893745sjdfhks83';
    const descriptor = 'desc';
    const expected = state
        .set('status', 'connected')
        .set('id', id)
        .set('error', null)
        .set('ethConnected', true);
    expect(ledgerHocReducer(state, ledgerEthAppConnected(descriptor, id))).toEqual(expected);
  });

  it('should handle LEDGER_CONNECTED action correctly', () => {
    const descriptor = 'desc';
    const expected = state
        .set('status', 'connected')
        .set('connected', true)
        .set('error', null)
        .set('descriptor', descriptor);
    expect(ledgerHocReducer(state, ledgerConnected(descriptor))).toEqual(expected);
  });

  it('should handle LEDGER_ETH_DISCONNECTED action correctly', () => {
    const expected = state
        .set('status', 'disconnected')
        .set('ethConnected', false);
    expect(ledgerHocReducer(state, ledgerEthAppDisconnected())).toEqual(expected);
  });

  it('should handle LEDGER_ERROR action correctly', () => {
    const error = 'oh no!';
    const expected = state
        .set('status', 'disconnected')
        .set('addresses', fromJS({}))
        .set('error', `Unknown error occured: ${error}`);
    expect(ledgerHocReducer(state, ledgerError(error))).toEqual(expected);
  });

  it('should handle FETCHED_LEDGER_ADDRESS action correctly', () => {
    const derivationPath = 'm01201010';
    const address = '0x0000000000000';
    const expected = state
        .setIn(['addresses', derivationPath], address);
    expect(ledgerHocReducer(state, fetchedLedgerAddress(derivationPath, address))).toEqual(expected);
  });

  it('should handle LEDGER_CONFIRM_TX_ON_DEVICE action correctly', () => {
    const expected = state
        .set('confTxOnDevice', true);
    expect(ledgerHocReducer(state, ledgerConfirmTxOnDevice())).toEqual(expected);
  });

  it('should handle LEDGER_CONFIRM_TX_ON_DEVICE_DONE action correctly', () => {
    const testState = state
        .set('confTxOnDevice', true);
    const expected = state
        .set('confTxOnDevice', false);
    expect(ledgerHocReducer(testState, ledgerConfirmTxOnDeviceDone())).toEqual(expected);
  });
});

import { fromJS } from 'immutable';

import {
  trezorDisconnectedErrorMsg,
} from 'utils/friendlyErrors';

import {
  trezorConfirmTxOnDeviceDone,
  trezorConfirmTxOnDevice,
} from '../actions';

import trezorHocReducer from '../reducer';

describe('trezorHocReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      status: 'disconnected',
      addresses: {},
      id: null,
      confTxOnDevice: false,
      error: trezorDisconnectedErrorMsg,
    });
  });

  it('returns the initial state', () => {
    expect(trezorHocReducer(undefined, {})).toEqual(state);
  });

  it('should handle TREZOR_CONFIRM_TX_ON_DEVICE action correctly', () => {
    const expected = state
          .set('confTxOnDevice', true);
    expect(trezorHocReducer(state, trezorConfirmTxOnDevice())).toEqual(expected);
  });

  it('should handle TREZOR_CONFIRM_TX_ON_DEVICE_DONE action correctly', () => {
    const testState = state
        .set('confTxOnDevice', true);
    const expected = state
        .set('confTxOnDevice', false);
    expect(trezorHocReducer(testState, trezorConfirmTxOnDeviceDone())).toEqual(expected);
  });
});

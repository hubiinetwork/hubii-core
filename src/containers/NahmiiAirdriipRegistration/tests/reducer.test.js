
import nahmiiAirdriipRegistrationReducer, { initialState } from '../reducer';
import {
  changeStage,
  changeManualAddress,
  changeManualSignedMessage,
  register,
  registerationSuccess,
  registerationFailed,
  checkAddressRegistrationSuccess,
  checkAddressRegistrationFailed,
} from '../actions';

describe('nahmiiAirdriipRegistrationReducer', () => {
  it('returns the initial state', () => {
    expect(nahmiiAirdriipRegistrationReducer(undefined, {})).toEqual(initialState);
  });

  it('handles the changeStage action correctly', () => {
    const expected = initialState.set('stage', 'some-stage');
    expect(nahmiiAirdriipRegistrationReducer(initialState, changeStage('some-stage'))).toEqual(expected);
  });

  it('handles the changeManualAddress action correctly', () => {
    const address = '0x00';
    const expected = initialState.setIn(['manualRegistrationInfo', 'address'], address);
    expect(nahmiiAirdriipRegistrationReducer(initialState, changeManualAddress(address))).toEqual(expected);
  });

  it('handles the changeManualSignedMessage action correctly', () => {
    const signedMessage = '0x00';
    const expected = initialState.setIn(['manualRegistrationInfo', 'signedMessage'], signedMessage);
    expect(nahmiiAirdriipRegistrationReducer(initialState, changeManualSignedMessage(signedMessage))).toEqual(expected);
  });

  it('handles the register action correctly', () => {
    const expected = initialState.set('registering', true);
    expect(nahmiiAirdriipRegistrationReducer(initialState, register())).toEqual(expected);
  });

  it('handles the registrationSuccess action correctly', () => {
    const addr = '0x001';
    const expected = initialState
      .setIn(['addressStatuses', addr], 'registered')
      .set('registering', false);
    const state = initialState.set('registering', true);
    expect(nahmiiAirdriipRegistrationReducer(state, registerationSuccess(addr))).toEqual(expected);
  });

  it('handles the registrationFailed action correctly', () => {
    const expected = initialState.set('registering', false);
    const state = initialState.set('registering', true);
    expect(nahmiiAirdriipRegistrationReducer(state, registerationFailed())).toEqual(expected);
  });

  it('handles the checkAddressRegistrationSuccess action correctly', () => {
    const addr = '0x001';
    const status = 'registered';
    const expected = initialState
      .setIn(['addressStatuses', addr], status);
    expect(nahmiiAirdriipRegistrationReducer(initialState, checkAddressRegistrationSuccess(addr, status))).toEqual(expected);
  });

  it('handles the checkAddressRegistrationFailed action correctly', () => {
    const addr = '0x001';
    const err = 'Error: some error';
    const expected = initialState
      .setIn(['addressStatuses', addr], err);
    expect(nahmiiAirdriipRegistrationReducer(initialState, checkAddressRegistrationFailed(addr, err))).toEqual(expected);
  });
});

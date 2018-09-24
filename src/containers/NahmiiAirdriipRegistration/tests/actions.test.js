
import {
  changeStage,
  changeManualAddress,
  changeManualSignedMessage,
  register,
  registerationFailed,
  registerationSuccess,
} from '../actions';

import {
  CHANGE_STAGE,
  REGISTER,
  CHANGE_MANUAL_ADDRESS,
  CHANGE_MANUAL_SIGNED_MESSAGE,
  REGISTRATION_SUCCESS,
  REGISTRATION_FAILED,
} from '../constants';

describe('NahmiiAirdriipRegistration actions', () => {
  describe('changeStage action', () => {
    it('returns the expected object', () => {
      const stage = 'some-stage';
      const expected = {
        type: CHANGE_STAGE,
        stage,
      };
      expect(changeStage(stage)).toEqual(expected);
    });
  });

  describe('changeManualAddress action', () => {
    it('returns the expected object', () => {
      const address = '0x00000000';
      const expected = {
        type: CHANGE_MANUAL_ADDRESS,
        address,
      };
      expect(changeManualAddress(address)).toEqual(expected);
    });
  });

  describe('changeManualSignedMessage action', () => {
    it('returns the expected object', () => {
      const signedMessage = '0x98234982halsjddf';
      const expected = {
        type: CHANGE_MANUAL_SIGNED_MESSAGE,
        signedMessage,
      };
      expect(changeManualSignedMessage(signedMessage)).toEqual(expected);
    });
  });

  describe('register action', () => {
    it('returns the expected object', () => {
      const expected = {
        type: REGISTER,
      };
      expect(register()).toEqual(expected);
    });
  });

  describe('registerationSuccess action', () => {
    it('returns the expected object', () => {
      const expected = {
        type: REGISTRATION_SUCCESS,
      };
      expect(registerationSuccess()).toEqual(expected);
    });
  });

  describe('registerationFailed action', () => {
    const error = new Error('some error');
    it('returns the expected object', () => {
      const expected = {
        type: REGISTRATION_FAILED,
        error,
      };
      expect(registerationFailed(error)).toEqual(expected);
    });
  });
});

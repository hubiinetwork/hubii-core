/*
 *
 * NahmiiAirdriipRegistration reducer
 *
 */

import { fromJS } from 'immutable';
import {
  CHANGE_STAGE,
  CHANGE_MANUAL_ADDRESS,
  CHANGE_MANUAL_SIGNED_MESSAGE,
  REGISTRATION_SUCCESS,
  REGISTRATION_FAILED,
  REGISTER,
} from './constants';

export const initialState = fromJS({
  stage: 'start',
  manualRegistrationInfo: {
    address: '',
    signedMessage: '',
  },
  registering: false,
});

function nahmiiAirdriipRegistrationReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_STAGE:
      return state
        .set('stage', action.stage);
    case CHANGE_MANUAL_ADDRESS:
      return state
        .setIn(['manualRegistrationInfo', 'address'], action.address);
    case CHANGE_MANUAL_SIGNED_MESSAGE:
      return state
        .setIn(['manualRegistrationInfo', 'signedMessage'], action.signedMessage);
    case REGISTER:
      return state
        .set('registering', true);
    case REGISTRATION_SUCCESS:
    case REGISTRATION_FAILED:
      return state
        .set('registering', false);
    default:
      return state;
  }
}

export default nahmiiAirdriipRegistrationReducer;

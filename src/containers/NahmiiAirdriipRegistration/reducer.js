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
  CHANGE_SELECTED_CORE_WALLET,
} from './constants';

const initialState = fromJS({
  stage: 'start',
  manualRegistrationInfo: {
    address: '',
    signedMessage: '',
  },
  selectedCoreWallet: {
    name: '',
    type: 'software',
    address: '0x0000000000000000000000000000000000000000',
  },
  registering: false,
  error: null,
  showSuccessMsg: false,
});

function nahmiiAirdriipRegistrationReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_STAGE:
      return state
        .set('stage', action.stage)
        .set('showSuccessMsg', false)
        .set('error', null);
    case CHANGE_SELECTED_CORE_WALLET:
      return state
        .set('selectedCoreWallet', fromJS(action.wallet))
        .set('showSuccessMsg', false)
        .set('error', null);
    case CHANGE_MANUAL_ADDRESS:
      return state
        .setIn(['manualRegistrationInfo', 'address'], action.address)
        .set('showSuccessMsg', false);
    case CHANGE_MANUAL_SIGNED_MESSAGE:
      return state
        .setIn(['manualRegistrationInfo', 'signedMessage'], action.signedMessage)
        .set('showSuccessMsg', false);
    case REGISTER:
      return state
        .set('registering', true)
        .set('error', null);
    case REGISTRATION_SUCCESS:
      return state
        .set('registering', false)
        .set('showSuccessMsg', true);
    case REGISTRATION_FAILED:
      return state
        .set('error', action.error)
        .set('registering', false);
    default:
      return state;
  }
}

export default nahmiiAirdriipRegistrationReducer;

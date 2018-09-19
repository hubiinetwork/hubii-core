/*
 *
 * NahmiiAirdriipRegistration reducer
 *
 */

import { fromJS } from 'immutable';
import {
  CHANGE_STAGE,
} from './constants';

const initialState = fromJS({
  stage: 'start',
});

function nahmiiAirdriipRegistrationReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_STAGE:
      return state
        .set('stage', action.stage);
    default:
      return state;
  }
}

export default nahmiiAirdriipRegistrationReducer;

/*
 *
 * contacts reducer
 *
 */

import { fromJS } from 'immutable';
import {
  REMOVE_CONTACT_SUCCESS,
  EDIT_CONTACT_SUCCESS,
  CREATE_CONTACT,
} from './constants';

export const initialState = fromJS([]);

function contactsReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_CONTACT:
      return fromJS([...state.toJS(), action.contactDetails]);
    case REMOVE_CONTACT_SUCCESS:
      return fromJS(action.remainingContacts);
    case EDIT_CONTACT_SUCCESS: {
      const newState = state.toJS();
      newState[action.index] = action.newContact;
      return fromJS([...newState]);
    }
    default:
      return state;
  }
}

export default contactsReducer;

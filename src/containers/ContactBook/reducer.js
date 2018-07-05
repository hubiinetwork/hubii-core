/*
 *
 * contacts reducer
 *
 */

import { fromJS } from 'immutable';
import {
  REMOVE_CONTACT,
  EDIT_CONTACT,
  CREATE_CONTACT,
} from './constants';

export const initialState = fromJS([]);

function contactsReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_CONTACT:
      return fromJS([...state.toJS(), action.contactDetails]);
    case REMOVE_CONTACT:
      return fromJS(action.remainingContacts);
    case EDIT_CONTACT: {
      return fromJS([...action.newContactsList]);
    }
    default:
      return state;
  }
}

export default contactsReducer;

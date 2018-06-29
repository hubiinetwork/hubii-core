/*
 *
 * WalletManager reducer
 *
 */

import { fromJS } from 'immutable';
import {
  LOAD_CONTACTS_SUCCESS,
  CREATE_CONTACT_SUCCESS,
  REMOVE_CONTACT_SUCCESS,
  EDIT_CONTACT_SUCCESS,
} from './constants';

const initialState = fromJS([]);

function walletManagerReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_CONTACT_SUCCESS:
      return fromJS([...state.toJS(), action.contactDetails]);
    case LOAD_CONTACTS_SUCCESS:
      return fromJS(action.contacts);
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

export default walletManagerReducer;

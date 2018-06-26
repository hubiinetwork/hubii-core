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
    default:
      return state;
  }
}

export default walletManagerReducer;

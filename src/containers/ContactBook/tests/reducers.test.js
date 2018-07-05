import { fromJS } from 'immutable';

import {
  createContact,
  removeContactSuccess,
  editContactSuccess,
} from '../actions';

import contactsReducer from '../reducer';

describe('ContactBook reducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS([]);
  });

  it('should return the initial state', () => {
    const expectedResult = state;
    expect(contactsReducer(state, {})).toEqual(expectedResult);
  });
  it('should handle the createContact action', () => {
    const contact = {
      name: 'mike',
      address: '0x342432',
    };
    const expectedResult = fromJS([...state.toJS(), contact]);
    expect(contactsReducer(state, createContact(contact.name, contact.address))).toEqual(expectedResult);
  });
  it('should handle the remove contact success action', () => {
    const remainingContacts = [
      {
        name: 'mike',
        address: '0x342432',
      },
      {
        name: 'joe',
        address: '0x342s32',
      },
    ];
    const expectedResult = fromJS(remainingContacts);
    expect(contactsReducer(state, removeContactSuccess(remainingContacts))).toEqual(expectedResult);
  });
  it('should handle the edit contact success action', () => {
    state = fromJS([
      {
        name: 'mike',
        address: '0x342432',
      },
      {
        name: 'joe',
        address: '0x342s32',
      },
    ]);

    const editedContact = {
      name: 'mike',
      address: '0x342432',
    };

    const index = 1;

    const newState = state.toJS();
    newState[index] = editedContact;
    const expectedResult = fromJS([...newState]);
    expect(contactsReducer(state, editContactSuccess(index, editedContact))).toEqual(expectedResult);
  });
});

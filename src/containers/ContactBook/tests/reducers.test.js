import { fromJS } from 'immutable';

import {
  createContact,
  removeContact,
  editContact,
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

  const contacts = [
    {
      name: 'mike',
      address: '0x342432',
    },
    {
      name: 'joe',
      address: '0x342s32',
    },
  ];
  it('should handle the remove contact success action', () => {
    const contact = {
      name: 'mike',
      address: '0x342432',
    };
    const expectedResult = fromJS([
      {
        name: 'joe',
        address: '0x342s32',
      },
    ]);
    expect(contactsReducer(state, removeContact(contacts, contact))).toEqual(expectedResult);
  });
  it('should handle the edit contact success action', () => {
    const oldContact = {
      name: 'mike',
      address: '0x342432',
    };
    const newContact = {
      name: 'tim',
      address: '0x342s32',
    };

    const expectedNewContactList = fromJS([
      {
        name: 'tim',
        address: '0x342s32',
      },
      {
        name: 'joe',
        address: '0x342s32',
      },
    ]);
    expect(contactsReducer(state, editContact(contacts, newContact, oldContact))).toEqual(expectedNewContactList);
  });
});

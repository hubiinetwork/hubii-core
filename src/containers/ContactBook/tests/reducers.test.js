import { fromJS } from 'immutable';

import {
  transferSuccess,
} from 'containers/WalletHoc/actions';

import {
  createContact,
  removeContact,
  editContact,
} from '../actions';


import contactsReducer from '../reducer';

describe('ContactBook reducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      contacts: [],
      recentContacts: [],
    });
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
    const expectedResult = state.set('contacts', fromJS([...state.toJS(), contact]));
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

  const recentContacts = [
    {
      name: 'mike',
      address: '0x342432',
    },
  ];

  it('should handle the remove contact success action', () => {
    const contact = {
      name: 'mike',
      address: '0x342432',
    };
    const expectedResult = state.set('contacts', fromJS([
      {
        name: 'joe',
        address: '0x342s32',
      },
    ]));
    expect(contactsReducer(state, removeContact(contacts, recentContacts, contact))).toEqual(expectedResult);
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

    const expectedNewContactList = state
      .set('contacts', fromJS([
        {
          name: 'tim',
          address: '0x342s32',
        },
        {
          name: 'joe',
          address: '0x342s32',
        },
      ]))
      .set('recentContacts', fromJS([
        {
          name: 'tim',
          address: '0x342s32',
        },
      ]));
    expect(contactsReducer(state, editContact(contacts, recentContacts, newContact, oldContact))).toEqual(expectedNewContactList);
  });
  it('should handle the transfer success action', () => {
    const transaction = {
      to: '0x342s32',
      from: '0x123213',
      hash: '123123',
      value: 4,
      data: 'input data',
      original: {},
    };
    const token = 'ETH';
    state = state.set('contacts', fromJS([
      {
        name: 'tim',
        address: '0x342s32',
      },
    ]));
    const expectedResult = state.set('recentContacts', fromJS([
      {
        name: 'tim',
        address: '0x342s32',
      },
    ]));
    expect(contactsReducer(state, transferSuccess(transaction, token))).toEqual(expectedResult);
  });
});

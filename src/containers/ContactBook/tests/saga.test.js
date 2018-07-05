/**
 * Test  sagas
 */

/* eslint-disable redux-saga/yield-effects */

import { takeEvery } from 'redux-saga/effects';
import { fromJS } from 'immutable';
import { expectSaga } from 'redux-saga-test-plan';

import contacts,
  {
    removeContact,
    editContact,
  } from '../saga';

import {
  removeContactSuccess,
  editContactSuccess } from '../actions';

import {
  REMOVE_CONTACT,
  EDIT_CONTACT,
  REMOVE_CONTACT_SUCCESS,
  EDIT_CONTACT_SUCCESS,
} from '../constants';

describe('ContactBook Saga', () => {
  describe('removeContact', () => {
    let contactBook;
    beforeEach(() => {
      contactBook = [
        {
          name: 'mike',
          address: '0x324234',
        },
        {
          name: 'john',
          address: '04234',
        },
        {
          name: 'ester',
          address: '0x344234',
        },
      ];
    });

    it('should remove a contact if it already exist', () => {
      const contact = {
        name: 'mike',
        address: '0x324234',
      };
      const expectedResult = [

        {
          name: 'john',
          address: '04234',
        },
        {
          name: 'ester',
          address: '0x344234',
        },
      ];
      return expectSaga(removeContact, { contact })
        .provide({
          select() {
            return fromJS(contactBook);
          },
        })
        .put(removeContactSuccess(expectedResult))
        .dispatch({ type: REMOVE_CONTACT_SUCCESS })
        .run({ silenceTimeout: true });
    });
    it('should not remove a contact if it does not exist', () => {
      const contact = {
        name: 'bobby',
        address: '0x324234',
      };
      const expectedResult = [
        {
          name: 'mike',
          address: '0x324234',
        },
        {
          name: 'john',
          address: '04234',
        },
        {
          name: 'ester',
          address: '0x344234',
        },
      ];
      return expectSaga(removeContact, { contact })
        .provide({
          select() {
            return fromJS(contactBook);
          },
        })
        .put(removeContactSuccess(expectedResult))
        .dispatch({ type: REMOVE_CONTACT_SUCCESS })
        .run({ silenceTimeout: true });
    });
    it('should not remove a contact if no contact given', () => {
      const contact = {};
      const expectedResult = [
        {
          name: 'mike',
          address: '0x324234',
        },
        {
          name: 'john',
          address: '04234',
        },
        {
          name: 'ester',
          address: '0x344234',
        },
      ];

      return expectSaga(removeContact, { contact })
        .provide({
          select() {
            return fromJS(contactBook);
          },
        })
        .put(removeContactSuccess(expectedResult))
        .dispatch({ type: REMOVE_CONTACT_SUCCESS })
        .run({ silenceTimeout: true });
    });
  });
  describe('editContact', () => {
    let contactBook;
    beforeEach(() => {
      contactBook = [
        {
          name: 'mike',
          address: '0x324234',
        },
        {
          name: 'john',
          address: '04234',
        },
        {
          name: 'ester',
          address: '0x344234',
        },
      ];
    });
    it('should edit a contact if there is a valid old and new contact', () => {
      const oldContact = {
        name: 'mike',
        address: '0x324234',
      };
      const newContact = {
        name: 'milo',
        address: '0x324234',
      };
      const expectedIndex = 0;

      return expectSaga(editContact, { oldContact, newContact })
      .provide({
        select() {
          return fromJS(contactBook);
        },
      })
      .put(editContactSuccess(expectedIndex, newContact))
      .dispatch({ type: EDIT_CONTACT_SUCCESS })
      .run({ silenceTimeout: true });
    });
    it('should not edit a contact if the old contact does not exist', () => {
      const oldContact = {
        name: 'nickky',
        address: '0x324234',
      };
      const newContact = {
        name: 'milo',
        address: '0x324234',
      };

      return expectSaga(editContact, { oldContact, newContact })
      .provide({
        select() {
          return fromJS(contactBook);
        },
      })
      .run({ silenceTimeout: true });
    });
  });
});

describe('root Saga', () => {
  const contactsSaga = contacts();

  it('should start task to watch for REMOVE_CONTACT action', () => {
    const takeDescriptor = contactsSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(REMOVE_CONTACT, removeContact));
  });

  it('should start task to watch for EDIT_CONTACT action', () => {
    const takeDescriptor = contactsSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(EDIT_CONTACT, editContact));
  });
});

/**
 * Test  sagas
 */

/* eslint-disable redux-saga/yield-effects */

import { takeEvery, put } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import contacts,
  {
    cacheContact,
    loadAllContacts,
    removeContact,
    editContact,
  } from '../saga';

import {
  loadAllContactsSucess,
  createContactSuccess,
  removeContactSuccess,
  editContactSuccess } from '../actions';

import {
  CREATE_CONTACT,
  LOAD_CONTACTS,
  REMOVE_CONTACT,
  EDIT_CONTACT } from '../constants';

describe('ContactBook Saga', () => {
  beforeEach(() => {
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn(),
    };
    global.localStorage = localStorageMock;
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('cacheContact', () => {
    let cacheContactGenerator;
    const contactDetails = {
      name: 'mike',
      address: '0x324234',
    };

    it('#cacheContact with null value in localStorage', () => {
      const contactBook = null;
      localStorage.getItem.mockReturnValueOnce(contactBook);
      localStorage.getItem.mockReturnValueOnce(contactBook);
      cacheContactGenerator = cacheContact({ contactDetails });
      const expectedContacts = [contactDetails];
      const putDescriptor = cacheContactGenerator.next().value;
      expect(localStorage.setItem).toBeCalledWith('contactBook', JSON.stringify(expectedContacts));
      expect(putDescriptor).toEqual(put(createContactSuccess(contactDetails.name, contactDetails.address)));
    });
    it('#cacheContact with valid value in localStorage', () => {
      const contactBook = [
        {
          name: 'john',
          address: '04234',
        },
      ];
      localStorage.getItem.mockReturnValueOnce(JSON.stringify(contactBook));
      localStorage.getItem.mockReturnValueOnce(JSON.stringify(contactBook));

      cacheContactGenerator = cacheContact({ contactDetails });

      const expectedContacts = [...contactBook, contactDetails];

      const putDescriptor = cacheContactGenerator.next().value;
      expect(localStorage.setItem).toBeCalledWith('contactBook', JSON.stringify(expectedContacts));
      expect(putDescriptor).toEqual(put(createContactSuccess(contactDetails.name, contactDetails.address)));
    });
    it('#cacheContact with invalid value in localStorage', () => {
      const contactBook = [
        {
          name: 'mike',
          addrs: '0x324234',
        },
      ];
      localStorage.getItem.mockReturnValueOnce(JSON.stringify(contactBook));
      localStorage.getItem.mockReturnValueOnce(JSON.stringify(contactBook));
      cacheContactGenerator = cacheContact({ contactDetails });

      const expectedContacts = [contactDetails];
      const putDescriptor = cacheContactGenerator.next().value;
      expect(putDescriptor).toEqual(put(createContactSuccess(contactDetails.name, contactDetails.address)));
      expect(localStorage.setItem).toBeCalledWith('contactBook', JSON.stringify(expectedContacts));
    });
  });

  describe('loadAllContacts', () => {
    it('#loadAllContacts with invalid value in localStorage', () => {
      const contactBook = [
        {
          name: 'mike',
          address: '0x324234',
        },
        {
          name: 'john',
          addss: '04234',
        },
        {
          name: 'ester',
          address: '0x344234',
        },
      ];
      const expectedResult = [
        {
          name: 'mike',
          address: '0x324234',
        },
        {
          name: 'ester',
          address: '0x344234',
        },
      ];
      localStorage.getItem.mockReturnValueOnce(JSON.stringify(contactBook));

      return expectSaga(loadAllContacts)
        .put(loadAllContactsSucess(expectedResult))
        .run({ silenceTimeout: true });
    });
    it('#loadAllContacts with valid value in localStorage', () => {
      const contactBook = [
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

      localStorage.getItem.mockReturnValueOnce(JSON.stringify(contactBook));

      return expectSaga(loadAllContacts)
        .put(loadAllContactsSucess(contactBook))
        .run({ silenceTimeout: true });
    });
    it('#loadAllContacts with null value in localStorage', () => {
      const contactBook = null;
      const expectedResult = [];
      localStorage.getItem.mockReturnValueOnce(JSON.stringify(contactBook));

      return expectSaga(loadAllContacts)
        .put(loadAllContactsSucess(expectedResult))
        .run({ silenceTimeout: true });
    });
  });

  describe('removeContact', () => {
    let contactBook;
    let removeContactGenerator;
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

      localStorage.getItem.mockReturnValueOnce(JSON.stringify(contactBook));
      removeContactGenerator = removeContact({ contact });
      const putDescriptor = removeContactGenerator.next().value;
      expect(putDescriptor).toEqual(put(removeContactSuccess(expectedResult)));
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

      localStorage.getItem.mockReturnValueOnce(JSON.stringify(contactBook));
      removeContactGenerator = removeContact({ contact });
      const putDescriptor = removeContactGenerator.next().value;
      expect(putDescriptor).toEqual(put(removeContactSuccess(expectedResult)));
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

      localStorage.getItem.mockReturnValueOnce(JSON.stringify(contactBook));
      removeContactGenerator = removeContact({ contact });
      const putDescriptor = removeContactGenerator.next().value;
      expect(putDescriptor).toEqual(put(removeContactSuccess(expectedResult)));
    });
  });

  describe('editContact', () => {
    let contactBook;
    let editContactGenerator;
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
      const expectedResult = [
        {
          name: 'milo',
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
      const expectedIndex = 0;
      localStorage.getItem.mockReturnValueOnce(JSON.stringify(contactBook));
      editContactGenerator = editContact({ oldContact, newContact });

      const putDescriptor = editContactGenerator.next().value;
      expect(putDescriptor).toEqual(put(editContactSuccess(expectedIndex, newContact)));
      expect(localStorage.setItem).toBeCalledWith('contactBook', JSON.stringify(expectedResult));
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

      localStorage.getItem.mockReturnValueOnce(JSON.stringify(contactBook));
      editContactGenerator = editContact({ oldContact, newContact });

      expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    });
  });
});

describe('root Saga', () => {
  const contactsSaga = contacts();

  it('should start task to watch for CREATE_CONTACT action', () => {
    const takeDescriptor = contactsSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(CREATE_CONTACT, cacheContact));
  });

  it('should start task to watch for LOAD_CONTACTS action', () => {
    const takeDescriptor = contactsSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(LOAD_CONTACTS, loadAllContacts));
  });

  it('should start task to watch for REMOVE_CONTACT action', () => {
    const takeDescriptor = contactsSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(REMOVE_CONTACT, removeContact));
  });

  it('should start task to watch for EDIT_CONTACT action', () => {
    const takeDescriptor = contactsSaga.next().value;
    expect(takeDescriptor).toEqual(takeEvery(EDIT_CONTACT, editContact));
  });
});

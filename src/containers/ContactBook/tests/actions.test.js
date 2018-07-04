import {
  createContact,
  createContactSuccess,
  loadAllContacts,
  loadAllContactsSucess,
  removeContact,
  removeContactSuccess,
  editContact,
  editContactSuccess } from '../actions';

import {
  LOAD_CONTACTS,
  LOAD_CONTACTS_SUCCESS,
  CREATE_CONTACT,
  CREATE_CONTACT_SUCCESS,
  REMOVE_CONTACT,
  REMOVE_CONTACT_SUCCESS,
  EDIT_CONTACT,
  EDIT_CONTACT_SUCCESS,
} from '../constants';


describe('ContactBook actions', () => {
  describe('createContact Action', () => {
    it('has the correct type', () => {
      const name = 'mike';
      const address = '0x324234';
      const expected = {
        type: CREATE_CONTACT,
        contactDetails: { name, address },
      };
      expect(createContact(name, address)).toEqual(expected);
    });
  });

  describe('createContactSuccess Action', () => {
    it('has the correct type and passes the contact', () => {
      const name = 'mike';
      const address = '0x324234';

      const expected = {
        type: CREATE_CONTACT_SUCCESS,
        contactDetails: { name, address },
      };
      expect(createContactSuccess(name, address)).toEqual(expected);
    });
  });

  describe('loadAllContacts Action', () => {
    it('has the correct type', () => {
      const expected = {
        type: LOAD_CONTACTS,
      };
      expect(loadAllContacts()).toEqual(expected);
    });
  });

  describe('loadAllContactsSucess Action', () => {
    it('has the correct type and passes the contacts to be loaded', () => {
      const contacts = [
        {
          name: 'mike',
          address: '0x324234',
        },
        {
          name: 'john',
          address: '0x234234',
        },
      ];
      const expected = {
        type: LOAD_CONTACTS_SUCCESS,
        contacts,
      };
      expect(loadAllContactsSucess(contacts)).toEqual(expected);
    });
  });

  describe('removeContact Action', () => {
    it('has the correct type and passes the contact to be deleted', () => {
      const contact = {
        name: 'mike',
        address: '0x324234',
      };
      const expected = {
        type: REMOVE_CONTACT,
        contact,
      };
      expect(removeContact(contact)).toEqual(expected);
    });
  });

  describe('removeContactSuccess Action', () => {
    it('has the correct type and passes the remaining contacts', () => {
      const remainingContacts = [
        {
          name: 'mike',
          address: '0x324234',
        },
        {
          name: 'john',
          address: '0x234234',
        },
      ];
      const expected = {
        type: REMOVE_CONTACT_SUCCESS,
        remainingContacts,
      };
      expect(removeContactSuccess(remainingContacts)).toEqual(expected);
    });
  });

  describe('editContact Action', () => {
    it('has the correct type and passes the old and new contact', () => {
      const newContact = {
        name: 'mike',
        address: '0x321231',
      };
      const oldContact = {
        name: 'joe',
        address: '0x12312312',
      };
      const expected = {
        type: EDIT_CONTACT,
        newContact,
        oldContact,
      };
      expect(editContact(newContact, oldContact)).toEqual(expected);
    });
  });

  describe('editContactSuccess Action', () => {
    it('has the correct type and passes the index and new contact', () => {
      const index = 1;
      const newContact = {
        name: 'mike',
        address: '0x321231',
      };
      const expected = {
        type: EDIT_CONTACT_SUCCESS,
        index,
        newContact,
      };
      expect(editContactSuccess(index, newContact)).toEqual(expected);
    });
  });
});


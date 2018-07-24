import {
  createContact,
  removeContact,
  editContact,
} from '../actions';

import {
  CREATE_CONTACT,
  REMOVE_CONTACT,
  EDIT_CONTACT,
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

  let contacts;
  let recentContacts;
  beforeEach(() => {
    contacts = [
      {
        name: 'mike',
        address: '0x2123123',
      },
      {
        name: 'john',
        address: '0x13123123',
      },
      {
        name: 'joe',
        address: '0x21231sd23',
      },
    ];
    recentContacts = [
      {
        name: 'mike',
        address: '0x2123123',
      },
      {
        name: 'joe',
        address: '0x21231sd23',
      },
    ];
  });

  describe('removeContact Action', () => {
    it('has the correct type and valid contact to delete', () => {
      const contact = {
        name: 'mike',
        address: '0x2123123',
      };
      const expectedRemainingList = [
        {
          name: 'john',
          address: '0x13123123',
        },
        {
          name: 'joe',
          address: '0x21231sd23',
        },
      ];

      const expectedRecentRemainingList = [
        {
          name: 'joe',
          address: '0x21231sd23',
        },
      ];
      const expected = {
        type: REMOVE_CONTACT,
        remainingContacts: expectedRemainingList,
        remainingRecentContacts: expectedRecentRemainingList,
      };
      expect(removeContact(contacts, recentContacts, contact)).toEqual(expected);
    });
    it('has the correct type and invalid contact to delete', () => {
      const contact = {
        name: 'mikey',
        address: '0x212asda3123',
      };
      const expectedRemainingList = [
        {
          name: 'mike',
          address: '0x2123123',
        },
        {
          name: 'john',
          address: '0x13123123',
        },
        {
          name: 'joe',
          address: '0x21231sd23',
        },
      ];
      const expectedRecentContactsList = [
        {
          name: 'mike',
          address: '0x2123123',
        },
        {
          name: 'joe',
          address: '0x21231sd23',
        },
      ];
      const expected = {
        type: REMOVE_CONTACT,
        remainingContacts: expectedRemainingList,
        remainingRecentContacts: expectedRecentContactsList,
      };
      expect(removeContact(contacts, recentContacts, contact)).toEqual(expected);
    });
  });

  describe('editContact Action', () => {
    it('has the correct type replaces a valid old contact with the new', () => {
      const newContact = {
        name: 'mitchell',
        address: '0x321231',
      };
      const oldContact = {
        name: 'mike',
        address: '0x2123123',
      };
      const expectedNewContactsList = [
        {
          name: 'mitchell',
          address: '0x321231',
        },
        {
          name: 'john',
          address: '0x13123123',
        },
        {
          name: 'joe',
          address: '0x21231sd23',
        },
      ];
      const expectedNewRecentContactsList = [
        {
          name: 'mitchell',
          address: '0x321231',
        },
        {
          name: 'joe',
          address: '0x21231sd23',
        },
      ];
      const expected = {
        type: EDIT_CONTACT,
        newContactsList: expectedNewContactsList,
        newRecentContactsList: expectedNewRecentContactsList,
      };
      expect(editContact(contacts, recentContacts, newContact, oldContact)).toEqual(expected);
    });
    it('has the correct type does not replace an invalid old contact with the new', () => {
      const newContact = {
        name: 'mitchell',
        address: '0x321231',
      };
      const oldContact = {
        name: 'simba',
        address: '0x2123123',
      };
      const expectedNewContactsList = [
        {
          name: 'mike',
          address: '0x2123123',
        },
        {
          name: 'john',
          address: '0x13123123',
        },
        {
          name: 'joe',
          address: '0x21231sd23',
        },
      ];
      const expected = {
        type: EDIT_CONTACT,
        newContactsList: expectedNewContactsList,
        newRecentContactsList: recentContacts,
      };
      expect(editContact(contacts, recentContacts, newContact, oldContact)).toEqual(expected);
    });
  });
});


/*
 *
 * contacts actions
 *
 */

import {
  CREATE_CONTACT,
  REMOVE_CONTACT,
  EDIT_CONTACT,
} from './constants';

export function createContact(name, address) {
  return {
    type: CREATE_CONTACT,
    contactDetails: { name, address },
  };
}

export function removeContact(contacts, recentContacts, contact) {
  const remainingContacts = contacts.filter(
    (person) =>
      !(person.address === contact.address && person.name === contact.name)
  );

  const remainingRecentContacts = recentContacts.filter(
    (person) =>
      !(person.address === contact.address && person.name === contact.name)
  );
  return {
    type: REMOVE_CONTACT,
    remainingContacts,
    remainingRecentContacts,
  };
}

export function editContact(contacts, recentContacts, newContact, oldContact) {
  const newContactsList = contacts.map(
    (contact) =>
      contact.name === oldContact.name && contact.address === oldContact.address ?
        newContact :
        contact
  );

  const newRecentContactsList = recentContacts.map(
    (contact) =>
      contact.name === oldContact.name && contact.address === oldContact.address ?
        newContact :
        contact
  );

  return {
    type: EDIT_CONTACT,
    newContactsList,
    newRecentContactsList,
  };
}

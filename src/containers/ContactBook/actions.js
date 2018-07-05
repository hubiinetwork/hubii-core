/*
 *
 * contacts actions
 *
 */

import {
  CREATE_CONTACT,
  REMOVE_CONTACT,
  REMOVE_CONTACT_SUCCESS,
  EDIT_CONTACT,
  EDIT_CONTACT_SUCCESS,
} from './constants';

export function createContact(name, address) {
  return {
    type: CREATE_CONTACT,
    contactDetails: { name, address },
  };
}

export function removeContact(contact) {
  return {
    type: REMOVE_CONTACT,
    contact,
  };
}

export function removeContactSuccess(remainingContacts) {
  return {
    type: REMOVE_CONTACT_SUCCESS,
    remainingContacts,
  };
}

export function editContact(newContact, oldContact) {
  return {
    type: EDIT_CONTACT,
    newContact,
    oldContact,
  };
}

export function editContactSuccess(index, newContact) {
  return {
    type: EDIT_CONTACT_SUCCESS,
    index,
    newContact,
  };
}

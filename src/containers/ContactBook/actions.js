/*
 *
 * contacts actions
 *
 */

import {
  LOAD_CONTACTS,
  LOAD_CONTACTS_SUCCESS,
  CREATE_CONTACT,
  CREATE_CONTACT_SUCCESS,
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

export function createContactSuccess(name, address) {
  return {
    type: CREATE_CONTACT_SUCCESS,
    contactDetails: { name, address },
  };
}


export function loadAllContacts() {
  return {
    type: LOAD_CONTACTS,
  };
}

export function loadAllContactsSucess(contacts) {
  return {
    type: LOAD_CONTACTS_SUCCESS,
    contacts,
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

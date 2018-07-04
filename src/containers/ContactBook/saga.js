import { takeEvery, put } from 'redux-saga/effects';
import { loadAllContactsSucess, createContactSuccess, removeContactSuccess, editContactSuccess } from './actions';
import { CREATE_CONTACT, LOAD_CONTACTS, REMOVE_CONTACT, EDIT_CONTACT } from './constants';
import { getContactsLocalStorage } from '../../utils/contact';


export function* cacheContact({ contactDetails }) {
  const contactBook = [];
  if (getContactsLocalStorage()) {
    contactBook.push(...getContactsLocalStorage());
  }
  contactBook.push({ ...contactDetails });
  window.localStorage.setItem('contactBook', JSON.stringify(contactBook));
  yield put(createContactSuccess(contactDetails.name, contactDetails.address));
}

export function* loadAllContacts() {
  const contactBook = getContactsLocalStorage();
  yield put(loadAllContactsSucess(contactBook));
}

export function* removeContact({ contact }) {
  const contactBook = getContactsLocalStorage();
  if (contactBook) {
    const remainingList = contactBook.filter((person) => !(person.address === contact.address && person.name === contact.name));
    window.localStorage.setItem('contactBook', JSON.stringify(remainingList));
    yield put(removeContactSuccess(remainingList));
  }
}

export function* editContact({ oldContact, newContact }) {
  const contactBook = getContactsLocalStorage();
  const reducer = (acc, currValue) => currValue.name === oldContact.name && currValue.address === oldContact.address ? contactBook.indexOf(currValue) : acc;
  const index = contactBook.reduce(reducer, -1);
  if (index >= 0) {
    contactBook[index] = newContact;
    window.localStorage.setItem('contactBook', JSON.stringify(contactBook));
    yield put(editContactSuccess(index, newContact));
  }
}

// Root watcher
export default function* contacts() {
  yield takeEvery(CREATE_CONTACT, cacheContact);
  yield takeEvery(LOAD_CONTACTS, loadAllContacts);
  yield takeEvery(REMOVE_CONTACT, removeContact);
  yield takeEvery(EDIT_CONTACT, editContact);
}

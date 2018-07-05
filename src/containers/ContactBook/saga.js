import { takeEvery, put, select } from 'redux-saga/effects';
import { removeContactSuccess, editContactSuccess } from './actions';
import { REMOVE_CONTACT, EDIT_CONTACT } from './constants';
import { makeSelectContacts } from './selectors';

export function* removeContact({ contact }) {
  let contactBook = yield select(makeSelectContacts());
  contactBook = contactBook.toJS();
  if (contactBook) {
    const remainingList = contactBook.filter((person) => !(person.address === contact.address && person.name === contact.name));
    yield put(removeContactSuccess(remainingList));
  }
}

export function* editContact({ oldContact, newContact }) {
  let contactBook = yield select(makeSelectContacts());
  contactBook = contactBook.toJS();
  const reducer = (acc, currValue) => currValue.name === oldContact.name && currValue.address === oldContact.address ? contactBook.indexOf(currValue) : acc;
  const index = contactBook.reduce(reducer, -1);
  if (index >= 0) {
    contactBook[index] = newContact;
    yield put(editContactSuccess(index, newContact));
  }
}

// Root watcher
export default function* contacts() {
  yield takeEvery(REMOVE_CONTACT, removeContact);
  yield takeEvery(EDIT_CONTACT, editContact);
}

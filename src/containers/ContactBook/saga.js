import { takeEvery, put } from 'redux-saga/effects';
import { loadAllContactsSucess, createContactSuccess, removeContactSuccess } from './actions';
import { CREATE_CONTACT, LOAD_CONTACTS, REMOVE_CONTACT } from './constants';
import { getContactsLocalStorage } from '../../utils/wallet';


export function* cacheContact({ contactDetails }) {
  let contactBook = [];
  if (JSON.parse(localStorage.getItem('contactBook'))) {
    contactBook = JSON.parse(localStorage.getItem('contactBook'));
    const preExisiting = contactBook.filter((contact) => contact.address === contactDetails.address);
    if (preExisiting.length) {
      console.log(`You already have this person under ${contactDetails.name}`);
    } else {
      contactBook.push({ ...contactDetails });
      localStorage.setItem('contactBook', JSON.stringify(contactBook));
      yield put(createContactSuccess(contactDetails.name, contactDetails.address, contactDetails.walletType));
    }
  }
}

export function* loadAllContacts() {
  console.log('loaded');
  const contactBook = getContactsLocalStorage();
  console.log(contactBook);
  try {
    yield put(loadAllContactsSucess(contactBook));
  } catch (e) {
    console.log(e);
  }
}

export function* removeContact({ contact }) {
  const contactBook = getContactsLocalStorage();
  console.log(contactBook);
  if (contactBook) {
    const remainingList = contactBook.filter((person) => person.address !== contact.address);
    console.log(remainingList.length);
    console.log(contactBook.length);
    if (remainingList.length === contactBook.length) {
      console.log('You did not delete anything');
    } else {
      localStorage.setItem('contactBook', JSON.stringify(remainingList));
      yield put(removeContactSuccess(remainingList));
    }
  }
}

// Root watcher
export default function* contacts() {
  yield takeEvery(CREATE_CONTACT, cacheContact);
  yield takeEvery(LOAD_CONTACTS, loadAllContacts);
  yield takeEvery(REMOVE_CONTACT, removeContact);
}

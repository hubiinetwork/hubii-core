export function getWalletsLocalStorage() {
  const defaultState = { software: {}, hardware: {} };
  try {
    const wallets = JSON.parse(localStorage.getItem('wallets')) || defaultState;
    return wallets;
  } catch (e) {
    return defaultState;
  }
}

export function getContactsLocalStorage() {
  const defaultState = [];
  try {
    const contacts = JSON.parse(localStorage.getItem('contactBook')) || defaultState;
    return contacts;
  } catch (e) {
    return defaultState;
  }
}

export function doesContactExist(contact) {
  const contacts = JSON.parse(localStorage.getItem('contactBook'));
  if (contacts) {
    const remainingList = contacts.filter((person) => person.address === contact.address);
    return remainingList.length ? remainingList[0] : 0;
  }
  return 0;
}

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

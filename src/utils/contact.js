export function getContactsLocalStorage() {
  const defaultState = [];
  try {
    const contacts = JSON.parse(localStorage.getItem('contactBook')) || defaultState;
    return contacts;
  } catch (e) {
    return defaultState;
  }
}

export function getContactsLocalStorage() {
  const defaultState = [];
  try {
    const contacts = JSON.parse(localStorage.getItem('contactBook')) || defaultState;
    return contacts.filter((contact) => contact.name && contact.address);
  } catch (e) {
    return defaultState;
  }
}

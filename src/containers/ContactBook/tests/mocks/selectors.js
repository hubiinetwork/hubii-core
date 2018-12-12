import { fromJS } from 'immutable';

// makeSelectContacts
export const contacts = fromJS([
  {
    name: 'mike',
    address: '0x324234',
  },
  {
    name: 'john',
    addss: '04234',
  },
  {
    name: 'ester',
    address: '0x344234',
  },
]);

export const contactsEmpty = fromJS([]);

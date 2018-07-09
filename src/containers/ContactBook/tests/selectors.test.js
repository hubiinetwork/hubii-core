import { fromJS } from 'immutable';

import { makeSelectContacts, selectContactsDomain } from '../selectors';

describe('selectContactsDomain', () => {
  it('should select the selectContactsDomain state', () => {
    const contactsState = fromJS([
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
    const mockedState = fromJS({
      contacts: contactsState,
    });
    expect(selectContactsDomain(mockedState)).toEqual(contactsState);
  });
});

describe('makeSelectContacts', () => {
  const makeSelectContactsSelector = makeSelectContacts();
  it('should select the contacts state', () => {
    const contacts = [
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
    ];
    const mockedState = fromJS({
      contacts,
    });
    expect(makeSelectContactsSelector(mockedState)).toEqual(fromJS(contacts));
  });
});

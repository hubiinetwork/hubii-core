import { fromJS } from 'immutable';

import { makeSelectContacts, makeSelectRecentContacts, selectContactsDomain } from '../selectors';

describe('selectContactsDomain', () => {
  it('should select the selectContactsDomain state', () => {
    const contactsState = fromJS({
      contacts: fromJS([
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
      ]),
      recentContacts: fromJS([
        {
          name: 'mike',
          address: '0x324234',
        },
        {
          name: 'john',
          addss: '04234',
        },
      ]),
    });

    const mockedState = fromJS({
      contacts: contactsState,
    });
    expect(selectContactsDomain(mockedState)).toEqual(contactsState);
  });
});

let contacts;
beforeEach(() => {
  contacts = fromJS({
    contacts: fromJS([
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
    ]),
    recentContacts: fromJS([
      {
        name: 'mike',
        address: '0x324234',
      },
      {
        name: 'john',
        addss: '04234',
      },
    ]),
  });
});
describe('makeSelectContacts', () => {
  const makeSelectContactsSelector = makeSelectContacts();
  it('should select the contacts state', () => {
    const expectedResult = [
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
    expect(makeSelectContactsSelector(mockedState)).toEqual(fromJS(expectedResult));
  });
  describe('makeSelectContacts', () => {
    const makeSelectRecentContactsSelector = makeSelectRecentContacts();
    it('should select the contacts state', () => {
      const expectedResult = [
        {
          name: 'mike',
          address: '0x324234',
        },
        {
          name: 'john',
          addss: '04234',
        },
      ];

      const mockedState = fromJS({
        contacts,
      });
      expect(makeSelectRecentContactsSelector(mockedState)).toEqual(fromJS(expectedResult));
    });
  });
});

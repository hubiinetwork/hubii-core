import { updateRecentContacts } from '../contacts';

describe('contacts helper methods', () => {
  describe('updateRecentContacts method', () => {
    let allContacts;
    let recentContacts;

    beforeEach(() => {
      allContacts = [
        {
          name: 'mike',
          address: '0x324234',
        },
        {
          name: 'john',
          address: '04234',
        },
        {
          name: 'ester',
          address: '0x344234',
        },
      ];
      recentContacts = [
        {
          name: 'mike',
          address: '0x324234',
        },
        {
          name: 'john',
          address: '04234',
        },
      ];
    });

    it('should handle if the transaction address is not in contacts', () => {
      const transaction = {
        to: '0x213123',
      };

      expect(updateRecentContacts(allContacts, recentContacts, transaction)).toEqual(recentContacts);
    });
    it('should handle if transaction address is a contact and does not exist recent contacts', () => {
      const transaction = {
        to: '0x344234',
      };
      const expectedResult = [
        {
          name: 'ester',
          address: '0x344234',
        },
        {
          name: 'mike',
          address: '0x324234',
        },
        {
          name: 'john',
          address: '04234',
        },
      ];
      expect(updateRecentContacts(allContacts, recentContacts, transaction)).toEqual(expectedResult);
    });
    it('should handle if transaction address is a contact and does exist recent contacts', () => {
      const transaction = {
        to: '04234',
      };
      const expectedResult = [
        {
          name: 'john',
          address: '04234',
        },
        {
          name: 'mike',
          address: '0x324234',
        },
      ];
      expect(updateRecentContacts(allContacts, recentContacts, transaction)).toEqual(expectedResult);
    });
  });
});

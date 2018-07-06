import { fromJS } from 'immutable';
import { convertWalletsList } from '../wallet';

describe('utils#wallet', () => {
  describe('#convertWalletsList', () => {
    const wallets = fromJS({
      software: {
        test1: {
          encrypted: '{"address": "abcd1"}',
        },
        test2: {
          encrypted: '{"address": "abcd2"}',
        },
      },
      hardware: {},
    });
    it('should convert wallets state into array', () => {
      const walletsList = convertWalletsList(wallets);
      const expected = [
                  { encrypted: { address: 'abcd1' }, address: '0xabcd1', name: 'test1', type: 'software' },
                  { encrypted: { address: 'abcd2' }, address: '0xabcd2', name: 'test2', type: 'software' },
      ];
      expect(walletsList).toEqual(expected);
    });
    it('should ignore invalid wallets with invalid encrypted json', () => {
      const walletStates = wallets
                  .setIn(['software', 'test3', 'encrypted'], 'invalid json')
                  .setIn(['software', 'test4', 'encrypted'], '{"address": "abcd4"}');
      const walletsList = convertWalletsList(walletStates);
      const expected = [
                  { encrypted: { address: 'abcd1' }, address: '0xabcd1', name: 'test1', type: 'software' },
                  { encrypted: { address: 'abcd2' }, address: '0xabcd2', name: 'test2', type: 'software' },
                  { encrypted: { address: 'abcd4' }, address: '0xabcd4', name: 'test4', type: 'software' },
      ];
      expect(walletsList).toEqual(expected);
    });
  });
});

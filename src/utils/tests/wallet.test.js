import { fromJS } from 'immutable';
import { convertWalletsList } from '../wallet';

describe('utils#wallet', () => {
  describe('#convertWalletsList', () => {
    const wallets = fromJS([
      { encrypted: '{"address": "abcd1"}', address: '0xabcd1', name: 'test1', type: 'software' },
      { encrypted: '{"address": "abcd2"}', address: '0xabcd2', name: 'test2', type: 'software' },
      { encrypted: '{"address": "abcd4"}', address: '0xabcd4', name: 'test4', type: 'software' },
    ]);
    it('should convert wallets state into array', () => {
      const walletsList = convertWalletsList(wallets);
      const expected = [
                  { encrypted: { address: 'abcd1' }, address: '0xabcd1', name: 'test1', type: 'software' },
                  { encrypted: { address: 'abcd2' }, address: '0xabcd2', name: 'test2', type: 'software' },
                  { encrypted: { address: 'abcd4' }, address: '0xabcd4', name: 'test4', type: 'software' },
      ];
      expect(walletsList).toEqual(expected);
    });
    it('should ignore invalid wallets with invalid encrypted json', () => {
      const test3Index = wallets.findIndex((wallet) => wallet.name === 'test3');
      const test4Index = wallets.findIndex((wallet) => wallet.name === 'test4');
      const walletStates = wallets
        .setIn([test3Index, 'encrypted'], 'invalid json')
        .setIn([test4Index, 'encrypted'], '{"address": "abcd4"}');
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

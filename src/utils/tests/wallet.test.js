import { fromJS } from 'immutable';
import { convertWalletsList, findWalletIndex } from '../wallet';

describe('utils#wallet', () => {
  const wallets = fromJS([
    { encrypted: '{"address": "abcd1"}', address: '0xabcd1', name: 'test1', type: 'software' },
    { encrypted: '{"address": "abcd2"}', address: '0xabcd2', name: 'test2', type: 'software' },
    { encrypted: '{"address": "abcd4"}', address: '0xabcd4', name: 'test4', type: 'software' },
  ]);
  describe('#convertWalletsList', () => {
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
  describe('findWalletIndex', () => {
    const state = fromJS({ wallets });
    it('should return the correct index when a wallet with the address param exists', () => {
      expect(findWalletIndex(state, '0xabcd1')).toEqual(0);
      expect(findWalletIndex(state, '0xabcd2')).toEqual(1);
      expect(findWalletIndex(state, '0xabcd4')).toEqual(2);
    });
    it('should call fatalError if looking up wallet without an address', () => {
      const fatalErrorSpy = jest.fn();
      findWalletIndex(state, 'rubbish', fatalErrorSpy);
      expect(fatalErrorSpy).toHaveBeenCalledTimes(1);
      findWalletIndex(state, '', fatalErrorSpy);
      expect(fatalErrorSpy).toHaveBeenCalledTimes(2);
      findWalletIndex(undefined, 'rubbish', fatalErrorSpy);
      expect(fatalErrorSpy).toHaveBeenCalledTimes(3);
    });
  });
});

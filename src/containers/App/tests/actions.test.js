import {
  notify, changeNetwork,
} from '../actions';
import {
  NOTIFY, CHANGE_NETWORK,
} from '../constants';

describe('App actions', () => {
  describe('notify Action', () => {
    const message = 'Wallet8';
    const messageType = 'word word word';
    it('returns expected output', () => {
      const expected = {
        type: NOTIFY,
        messageType,
        message,
      };
      expect(notify(messageType, message)).toEqual(expected);
    });
  });
  describe('changeNetwork Action', () => {
    const name = 'ropsten';
    it('returns expected output', () => {
      const expected = {
        type: CHANGE_NETWORK,
        name,
      };
      expect(changeNetwork(name)).toEqual(expected);
    });
  });
});

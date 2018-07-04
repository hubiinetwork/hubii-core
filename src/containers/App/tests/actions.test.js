import {
  notify,
} from '../actions';
import {
  NOTIFY,
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
});

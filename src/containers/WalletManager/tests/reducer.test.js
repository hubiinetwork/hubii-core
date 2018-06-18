
import { fromJS } from 'immutable';
import walletManagerReducer from '../reducer';

describe('walletManagerReducer', () => {
  it('returns the initial state', () => {
    expect(walletManagerReducer(undefined, {})).toEqual(fromJS({}));
  });
});

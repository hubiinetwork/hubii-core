
import { fromJS } from 'immutable';
import nahmiiAirdriipRegistrationReducer from '../reducer';

describe('nahmiiAirdriipRegistrationReducer', () => {
  it('returns the initial state', () => {
    expect(nahmiiAirdriipRegistrationReducer(undefined, {})).toEqual(fromJS({}));
  });
});

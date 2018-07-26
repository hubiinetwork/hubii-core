
import { fromJS } from 'immutable';
import settingsReducer from '../reducer';

describe('settingsReducer', () => {
  it('returns the initial state', () => {
    expect(settingsReducer(undefined, {})).toEqual(fromJS({}));
  });
});

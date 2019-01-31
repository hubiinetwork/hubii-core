import { fromJS, Set } from 'immutable';
import { makeSelectErrors } from '../selectors';

const mockedState = fromJS({
  connectionStatus: {
    errors: new Set(),
  },
});

describe('makeSelectErrors', () => {
  const errorsSelector = makeSelectErrors();
  it('should return the correct state', () => {
    const expected = mockedState.getIn(['connectionStatus', 'errors']);
    expect(errorsSelector(mockedState)).toEqual(expected);
  });
});

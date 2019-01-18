
import { fromJS, Set } from 'immutable';

import connectionStatusReducer from '../reducer';
import { networkFailure, networkReconnected } from '../actions';

const initialState = fromJS({
  errors: new Set(),
});

const errorType = 'some_error';

describe('connectionStatusReducer', () => {
  it('returns the initial state', () => {
    expect(connectionStatusReducer(undefined, {})).toEqual(initialState);
  });

  it('handles NETWORK_FAILURE correctly', () => {
    const mockState = initialState;
    const expected = mockState.updateIn(['errors'], (errors) => errors.add(errorType));
    expect(connectionStatusReducer(mockState, networkFailure(errorType))).toEqual(expected);
  });
  it('handles NETWORK_RECONNECTED correctly', () => {
    const mockState = initialState;
    const expected = mockState.updateIn(['errors'], (errors) => errors.remove(errorType));
    expect(connectionStatusReducer(mockState, networkReconnected(errorType))).toEqual(expected);
  });
});

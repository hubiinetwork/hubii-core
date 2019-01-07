import { fromJS } from 'immutable';

import {
  LOAD_PRICE_HISTORY,
  LOAD_PRICE_HISTORY_SUCCESS,
  LOAD_PRICE_HISTORY_ERROR,
  UPDATE_LATEST_PRICE_SUCCESS,
} from './constants';


export const initialState = fromJS({
  prices: {},
  latestPrice: {},
});

function dexReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_PRICE_HISTORY:
      return state
        .setIn(['prices', action.currency, 'loading'], true)
        .setIn(['prices', action.currency, 'error'], null);
    case LOAD_PRICE_HISTORY_SUCCESS:
      return state
        .setIn(['prices', action.currency, 'loading'], false)
        .setIn(['prices', action.currency, 'history'], action.data)
        .setIn(['prices', action.currency, 'error'], null);
    case LOAD_PRICE_HISTORY_ERROR:
      return state
        .setIn(['prices', action.currency, 'loading'], false)
        .setIn(['prices', action.currency, 'error'], action.error);
    case UPDATE_LATEST_PRICE_SUCCESS:
      return state
        .setIn(['latestPrice', action.currency], fromJS(action.price));
    default:
      return state;
  }
}

export default dexReducer;

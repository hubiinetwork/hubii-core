/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux-immutable';
import { LOCATION_CHANGE } from 'react-router-redux';

import languageProviderReducer from 'containers/LanguageProvider/reducer';
import contactsReducer from 'containers/ContactBook/reducer';
import walletHocReducer from 'containers/WalletHOC/reducer';
import hubiiApiHocReducer from 'containers/HubiiApiHoc/reducer';
import ethOperationsHocReducer from 'containers/EthOperationsHoc/reducer';

/*
 * routeReducer
 *
 * The reducer merges route location changes into our immutable state.
 * The change is necessitated by moving to react-router-redux@5
 *
 */

export function location(state = null, action) {
  switch (action.type) {
    case LOCATION_CHANGE:
      return action.payload;
    default:
      return state;
  }
}
const routeReducer = combineReducers({ location });

/**
 * Creates the main reducer with the dynamically injected ones
 */
export default function createReducer(injectedReducers) {
  return combineReducers({
    route: routeReducer,
    contacts: contactsReducer,
    walletHoc: walletHocReducer,
    hubiiApiHoc: hubiiApiHocReducer,
    ethOperationsHoc: ethOperationsHocReducer,
    language: languageProviderReducer,
    ...injectedReducers,
  });
}

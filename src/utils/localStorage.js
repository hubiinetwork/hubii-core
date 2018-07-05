import { fromJS } from 'immutable';

import { initialState as walletHocInitialState } from 'containers/WalletHOC/reducer';
import { initialState as contactsInitialState } from 'containers/ContactBook/reducer';


export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return {};
    }
    return JSON.parse(serializedState);
  } catch (e) {
    return {};
  }
};

export const saveState = (state) => {
  try {
    const persistedState = filterPersistedState(state);
    const serializedPersistedState = JSON.stringify(persistedState);
    localStorage.setItem('state', serializedPersistedState);
  } catch (e) {
    // Ignore write errors
  }
};

/*
 * Filters state we want out of the Redux store
 *
 * NOTE: To persist state from a reducer, it needs to be specified in createReducer()
 * (found in src/reducers.js). If you're getting errors, make sure all reducers
 * persisted are added there
 */
export const filterPersistedState = (state) => {
  let persistedState = fromJS({});

  /*
   * Sanitised software wallets from WalletHOC
   */

  // Start with clean initialState
  persistedState = persistedState.set('contacts', contactsInitialState);
  persistedState = persistedState.set('walletManager', walletHocInitialState);

  // Get software wallets ensuring the decrypted property is filtered out
  const sanitizedSoftwareWallets = state
    .getIn(['walletManager', 'wallets', 'software'])
    .map(((w) => w.set('decrypted', null)));
  // Save sanitized software wallets to the persisted state
  persistedState = persistedState
    .setIn(['walletManager', 'wallets', 'software'], sanitizedSoftwareWallets);

  persistedState = persistedState
    .set('contacts', state.get('contacts'));
  return persistedState;
};

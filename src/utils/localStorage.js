import { fromJS } from 'immutable';

import { initialState as walletHocInitialState } from 'containers/WalletHOC/reducer';
import { initialState as contactsInitialState } from 'containers/ContactBook/reducer';


export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return {};
    }
    const restoredState = JSON.parse(serializedState);

    if (restoredState.walletHoc) {
      // init the properties from initialState if does not exist in stored state
      const walletHocInitialStateJSON = walletHocInitialState.toJSON();
      Object.keys(walletHocInitialStateJSON).forEach((prop) => {
        if (restoredState.walletHoc[prop] === undefined || restoredState.walletHoc[prop] === null) {
          restoredState.walletHoc[prop] = walletHocInitialStateJSON[prop];
        }
      });
    }

    return restoredState;
  } catch (e) {
    return {};
  }
};

export const saveState = (state, filterPersistedState) => {
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

  // Start with clean initialState
  persistedState = persistedState.set('contacts', contactsInitialState);
  persistedState = persistedState.set('walletHoc', walletHocInitialState);

  /*
   * Sanitised software wallets from WalletHOC
   */

  // Get software wallets ensuring the decrypted property is filtered out
  const sanitizedSoftwareWallets = state
    .getIn(['walletHoc', 'wallets'])
    .map(((w) => w.delete('decrypted', null)));
  // Save sanitized software wallets to the persisted state
  persistedState = persistedState
    .setIn(['walletHoc', 'wallets'], sanitizedSoftwareWallets);


  /**
   * Saved hardware wallets
   */
  persistedState = persistedState
    .setIn(['walletHoc', 'wallets', 'hardware'], state.getIn(['walletHoc', 'wallets', 'hardware']));


  /**
   * Contacts
   */
  persistedState = persistedState
    .set('contacts', state.get('contacts'));


  return persistedState;
};

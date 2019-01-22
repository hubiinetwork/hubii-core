import { createSelector } from 'reselect';

/**
 * Direct selector to the connectionStatus state domain
 */
const selectConnectionStatusDomain = (state) => state.get('connectionStatus');

/**
 * Other specific selectors
 */
const makeSelectErrors = () => createSelector(
  selectConnectionStatusDomain,
  (substate) => substate.get('errors')
);


export {
  selectConnectionStatusDomain,
  makeSelectErrors,
};

import { createSelector } from 'reselect';

/**
 * Direct selector to the walletManager state domain
 */
const selectContactsDomain = (state) => state.get('contacts');

const makeSelectContacts = () => createSelector(
  selectContactsDomain,
  (contactsDomain) => contactsDomain
);


export {
  makeSelectContacts,
  selectContactsDomain,
};

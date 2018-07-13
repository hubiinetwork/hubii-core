import { createSelector } from 'reselect';

/**
 * Direct selector to the contacts state domain
 */
const selectContactsDomain = (state) => state.get('contacts');

const makeSelectContacts = () => createSelector(
  selectContactsDomain,
  (contactsDomain) => contactsDomain.get('contacts')
);

const makeSelectRecentContacts = () => createSelector(
  selectContactsDomain,
  (contactsDomain) => contactsDomain.get('recentContacts')
);

export {
  makeSelectContacts,
  makeSelectRecentContacts,
  selectContactsDomain,
};

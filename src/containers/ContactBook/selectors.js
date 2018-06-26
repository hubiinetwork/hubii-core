import { createSelector } from 'reselect';

/**
 * Direct selector to the walletManager state domain
 */
const selectContactsDomain = (state) => state.get('contacts');

// /**
//  * Other specific selectors
//  */
// const makeSelectPasswordInput = () => createSelector(
//   selectWalletManagerDomain,
//   (walletManagerDomain) => walletManagerDomain.getIn(['inputs', 'password'])
// );

// Contacts

const makeSelectContacts = () => createSelector(
  selectContactsDomain,
  (contactsDomain) => contactsDomain
);


export {
  makeSelectContacts,
};

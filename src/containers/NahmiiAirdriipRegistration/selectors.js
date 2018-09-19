import { createSelector } from 'reselect';

/**
 * Direct selector to the nahmiiAirdriipRegistration state domain
 */
const selectNahmiiAirdriipRegistrationDomain = (state) => state.get('nahmiiAirdriipRegistration');

/**
 * Other specific selectors
 */


/**
 * Default selector used by NahmiiAirdriipRegistration
 */

const makeSelectNahmiiAirdriipRegistration = () => createSelector(
  selectNahmiiAirdriipRegistrationDomain,
  (substate) => substate.toJS()
);

export default makeSelectNahmiiAirdriipRegistration;
export {
  selectNahmiiAirdriipRegistrationDomain,
};

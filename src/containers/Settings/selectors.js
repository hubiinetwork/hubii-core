import { createSelector } from 'reselect';

/**
 * Direct selector to the settings state domain
 */
const selectSettingsDomain = (state) => state.get('settings');

/**
 * Other specific selectors
 */


/**
 * Default selector used by Settings
 */

const makeSelectSettings = () => createSelector(
  selectSettingsDomain,
  (substate) => substate.toJS()
);

export default makeSelectSettings;
export {
  selectSettingsDomain,
};

import { createSelector } from 'reselect';

const selectAppDomain = (state) => state.get('app');
const selectRoute = (state) => state.get('route');

const makeSelectCurrentNetwork = () => createSelector(
  selectAppDomain,
  (appDomain) => appDomain.get('currentNetwork').toJS()
);

const makeSelectSupportedNetworks = () => createSelector(
  selectAppDomain,
  (appDomain) => appDomain.get('supportedNetworks')
);

const makeSelectPathnameId = () => createSelector(
  selectRoute,
  (routeState) => {
    const pathname = routeState.get('location').pathname;
    return pathname.split('/').pop(); // grab the ID from the pathname
  }
);

const makeSelectRestoreContents = () => createSelector(
  selectAppDomain,
  (appDomain) => appDomain.getIn(['restore', 'import', 'data'])
);

export {
  makeSelectPathnameId,
  makeSelectCurrentNetwork,
  makeSelectSupportedNetworks,
  makeSelectRestoreContents,
};

import { createSelector } from 'reselect';

const selectRoute = (state) => state.get('route');
const selectApp = (state) => state.get('app');

const makeSelectLocation = () => createSelector(
  selectRoute,
  (routeState) => routeState.get('location').toJS()
);

const makeSelectPathnameId = () => createSelector(
  selectRoute,
  (routeState) => {
    const pathname = routeState.get('location').pathname;
    return pathname.split('/').pop(); // grab the ID from the pathname
  }
);

const makeSelectReleaseNotes = () => createSelector(
  selectApp,
  (routeState) => routeState.get('releaseNotes').toJS()
);

export {
  makeSelectLocation,
  makeSelectPathnameId,
  makeSelectReleaseNotes,
};

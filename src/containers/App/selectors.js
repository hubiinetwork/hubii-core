import { createSelector } from 'reselect';

const selectRoute = (state) => state.get('route');

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

export {
  makeSelectLocation,
  makeSelectPathnameId,
};

import { createSelector } from 'reselect';

const selectDexDomain = (state) => state.get('dex');

const makeSelectPriceHistory = () => createSelector(
  selectDexDomain,
  (dexDomain) => dexDomain.getIn(['prices'])
);
const makeSelectLatestPrice = () => createSelector(
  selectDexDomain,
  (dexDomain) => dexDomain.getIn(['latestPrice'])
);


export {
  makeSelectPriceHistory,
  makeSelectLatestPrice,
};

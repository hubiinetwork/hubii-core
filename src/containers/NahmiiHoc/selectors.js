import { createSelector } from 'reselect';
import { fromJS } from 'immutable';
import BigNumber from 'bignumber.js';

/**
 * Direct selector to the nahmiiHoc state domain
 */
const selectNahmiiHocDomain = (state) => state.get('nahmiiHoc');

const makeSelectDepositStatus = () => createSelector(
  selectNahmiiHocDomain,
  (nahmiiHocDomain) => nahmiiHocDomain.get('depositStatus')
);

const makeSelectNahmiiBalances = () => createSelector(
  selectNahmiiHocDomain,
  (nahmiiHocDomain) => {
    const balances = nahmiiHocDomain.get('balances') || fromJS({});

    // create a 'total' balance entry for each address
    let balancesWithTotal = balances;
    balances.forEach((address, i) => {
      let total = fromJS({
        loading: false,
        error: false,
        assets: [],
      });
      total = address.toSetSeq().reduce((acc, cur) => {
        // if any are loading/erroed for this address set it's 'total' to loading/errored and 'assets' to none
        if (acc.get('loading') || acc.get('error')) return acc;
        if (cur.get('loading')) {
          return acc
            .set('loading', true)
            .set('assets', fromJS([]));
        }
        if (cur.get('error')) {
          return acc
            .set('error', 'someerror')
            .set('assets', fromJS([]));
        }

        let assets = acc.get('assets');
        for (let j = 0; j < cur.get('assets').size; j += 1) {
          const assetIndex = assets.findIndex((asset) => asset.get('currency') === cur.getIn(['assets', j, 'currency']));
          // asset not yet in total, add it
          if (assetIndex === -1) {
            assets = assets.push(cur.getIn(['assets', j]));
          } else {
            // asset in total, add to the balance
            assets = assets.setIn(
            [assetIndex, 'balance'],
            new BigNumber(assets.getIn([assetIndex, 'balance'])).plus(cur.getIn(['assets', j, 'balance'])).toString());
          }
        }
        return acc.set('assets', assets);
      }, total);
      balancesWithTotal = balancesWithTotal.setIn([i, 'total'], total);
    });
    return balancesWithTotal;
  }
);


export {
  makeSelectNahmiiBalances,
  makeSelectDepositStatus,
};

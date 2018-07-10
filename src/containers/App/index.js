/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import { compose } from 'redux';
import { Switch, Route, Redirect } from 'react-router-dom';

import injectSaga from 'utils/injectSaga';

import SideBar from 'components/SideBar';
import Striim from 'containers/Striim';
import WalletManager from 'containers/WalletManager';
import WalletDetails from 'containers/WalletDetails';

import withExchangeRate from 'containers/ExchangeRateHOC';
import WalletHOC from 'containers/WalletHOC';

import saga from './saga';

import logoSvg from '../../../public/Images/corerz-logo.svg';

export function App() {
  const menuItems = [
    {
      to: '/wallets',
      icon: 'wallet',
      name: 'Wallet Manager',
    },
    {
      to: '/striim',
      icon: 'striim',
      name: 'striim detail',
    },
    {
      to: '/dex',
      icon: 'dex',
      name: 'dex detail',
    },
  ];
  return (
    <SideBar menuItems={menuItems} logoSrc={logoSvg}>
      <Switch>
        <Route path="/wallets" component={WalletManager} />
        <Route path="/wallet/:address" component={WalletDetails} />
        <Route path="/striim" component={Striim} />
        <Redirect from="/" to="/wallets" />
      </Switch>
    </SideBar>
  );
}

const withSaga = injectSaga({ key: 'app', saga });

export default compose(
  withSaga,
  withExchangeRate,
  WalletHOC,
)(App);

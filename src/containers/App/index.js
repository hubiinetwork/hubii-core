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
import { Switch, Route } from 'react-router-dom';
import Striim from 'containers/Striim';
import SideBar from 'components/SideBar';
import NotFoundPage from 'containers/NotFoundPage/Loadable';

import withExchangeRate from 'containers/ExchangeRateHOC';

import logoSvg from '../../../public/Images/corerz-logo.svg';

export function App() {
  const menuItems = [
    {
      to: '/wallet',
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
        <Route path="/striim" component={Striim} />
        <Route component={NotFoundPage} />
      </Switch>
    </SideBar>
  );
}

export default compose(withExchangeRate)(App);

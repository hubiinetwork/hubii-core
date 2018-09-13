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
import Helmet from 'react-helmet';
import { Switch, Route } from 'react-router-dom';

import { getAbsolutePath } from 'utils/electron';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import HomeScreen from 'components/HomeScreen';
import SideBar from 'components/SideBar';
import Striim from 'containers/Striim';
import WalletManager from 'containers/WalletManager';
import WalletDetails from 'containers/WalletDetails';
import Dex from 'containers/Dex';
import Settings from 'containers/Settings';

import WalletHOC from 'containers/WalletHOC';
import withLedger from 'containers/LedgerHoc';
import withTrezor from 'containers/TrezorHoc';

import ReleaseNotesModal from 'containers/ReleaseNotesModal';

import reducer from './reducer';
import saga from './saga';

function App() {
  const menuItems = [
    {
      to: '/wallets',
      icon: 'wallet',
      name: 'Wallet Manager',
    },
    {
      to: '/dex',
      icon: 'dex',
      name: 'dex detail',
    },
  ];
  return (
    <SideBar menuItems={menuItems} logoSrc={getAbsolutePath('public/images/hubii-core-logo.svg')}>
      <Helmet>
        <title>hubii core</title>
      </Helmet>
      <Switch>
        <Route path="/wallets" component={WalletManager} />
        <Route path="/wallet/:address" component={WalletDetails} />
        <Route path="/striim" component={Striim} />
        <Route path="/dex" component={Dex} />
        <Route path="/settings" component={Settings} />
        <Route component={HomeScreen} />
      </Switch>
      <ReleaseNotesModal />
    </SideBar>
  );
}

const withReducer = injectReducer({ key: 'app', reducer });
const withSaga = injectSaga({ key: 'app', saga });

export default compose(
  withReducer,
  withSaga,
  WalletHOC,
  withLedger,
  withTrezor
)(App);

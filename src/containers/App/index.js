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
import WalletManager from 'containers/WalletManager';
import WalletDetails from 'containers/WalletDetails';
import Dex from 'containers/Dex';
import Settings from 'containers/Settings';
import Nahmii from 'containers/Nahmii';

import ConnectionStatus from 'containers/ConnectionStatus';
import WalletHoc from 'containers/WalletHoc';
import withLedger from 'containers/LedgerHoc';
import withTrezor from 'containers/TrezorHoc';
import withHubiiApi from 'containers/HubiiApiHoc';
import withEthOperations from 'containers/EthOperationsHoc';
import withNahmii from 'containers/NahmiiHoc';

import ReleaseNotesModal from 'containers/ReleaseNotesModal';
import { injectIntl } from 'react-intl';

import reducer from './reducer';
import saga from './saga';

function App() {
  const menuItems = [
    {
      to: '/wallets',
      icon: 'wallet',
      key: 'wallet',
    },
    {
      to: '/nahmii/airdriip-registration',
      icon: 'nahmii-token',
      key: 'nahmii',
    },
    {
      to: '/dex',
      icon: 'dex',
      key: 'dex',
    },
  ];
  return (
    <SideBar menuItems={menuItems} logoSrc={getAbsolutePath('public/images/hubii-core-logo.svg')}>
      <Helmet>
        <title>hubii core</title>
      </Helmet>
      <ConnectionStatus />
      <Switch>
        <Route path="/wallets" component={WalletManager} />
        <Route path="/wallet/:address" component={WalletDetails} />
        <Route path="/dex" component={Dex} />
        <Route path="/nahmii" component={Nahmii} />
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
  WalletHoc,
  withLedger,
  withTrezor,
  withEthOperations,
  withNahmii,
  withHubiiApi,
)(injectIntl(App));

import React from 'react';
import { shallow } from 'enzyme';
import { Switch, Route, Redirect } from 'react-router-dom';

import HomeScreen from 'components/HomeScreen';
import Striim from 'containers/Striim';
import WalletManager from 'containers/WalletManager';
import WalletDetails from 'containers/WalletDetails';
import { SideBar } from '../SideBar.component';

describe('<SideBar />', () => {
  const menuItems = [
    {
      to: '/wallets',
      icon: 'wallet',
      name: 'Wallet Manager',
    },
    {
      to: '/wallet',
      icon: 'striim',
      name: 'striim detail',
    },
    {
      to: '/dex',
      icon: 'dex',
      name: 'dex detail',
    },
  ];
  const props = {
    menuItems,
    location: { pathname: 'hello/world' },
    logoSrc: '../../../public/images/hubii-core-logo.svg',
  };

  it('should render correctly', () => {
    const wrapper = shallow(
      <SideBar {...props}>
        <Switch>
          <Route exact path="/" component={HomeScreen} />
          <Route path="/wallets" component={WalletManager} />
          <Route path="/wallet/:address" component={WalletDetails} />
          <Route path="/striim" component={Striim} />
          <Redirect from="/" to="/wallets" />
        </Switch>
      </SideBar>
    );
    expect(wrapper).toMatchSnapshot();
  });
});

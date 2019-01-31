import React from 'react';
import { shallow } from 'enzyme';
import { Switch, Route, Redirect } from 'react-router-dom';

import HomeScreen from 'components/HomeScreen';
import WalletManager from 'containers/WalletManager';
import WalletDetails from 'containers/WalletDetails';
import { SideBar } from '../index';

describe('<SideBar />', () => {
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
          <Redirect from="/" to="/wallets" />
        </Switch>
      </SideBar>
    );
    expect(wrapper).toMatchSnapshot();
  });
});

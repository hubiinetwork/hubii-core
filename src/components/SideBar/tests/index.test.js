import React from 'react';
import { shallow, mount } from 'enzyme';
import { MemoryRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import dark from '../../../themes/darkTheme';

import SideBar from '../index';

describe('<SideBar />', () => {
  const menuItems = [
    {
      to: '/wallets',
      icon: 'wallet',
      name: 'Wallet Manager'
    },
    {
      to: '/wallet',
      icon: 'striim',
      name: 'striim detail'
    },
    {
      to: '/dex',
      icon: 'dex',
      name: 'dex detail'
    }
  ];
  const props = {
    menuItems,
    logoSrc: '../../../public/images/hubii-core-logo.svg'
  };

  it('should render correctly', () => {
    const wrapper = shallow(
      <SideBar {...props}>
        <div />
      </SideBar>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should mount correctly', () => {
    const wrapper = mount(
      <Router>
        <ThemeProvider theme={dark}>
          <SideBar {...props}>
            <div />
          </SideBar>
        </ThemeProvider>
      </Router>
    );
    const sidebar = wrapper.find('.ant-layout-sider');
    expect(sidebar.props().className).toHaveLength(65);
  });
});

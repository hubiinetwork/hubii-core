import { Icon, Layout, Menu } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '../ui/SvgIcon';
import darkTheme from '../../themes/darkTheme';

import NahmiiGrey from '../../../public/images/nahmii-token-grey.png';
import NahmiiGreen from '../../../public/images/nahmii-token-green.png';

import { SideBarLayout, SideBarMenu } from './SideBar.style';

const { Sider } = Layout;

/**
 * Side bar component to show features on a long, usually left, bar.
 */

export class SideBar extends React.Component {
  getroute() {
    const { location } = this.props;
    const arr = location.pathname.split('/');
    return `/${arr[1]}`;
  }

  render() {
    const { menuItems, logoSrc, children } = this.props;
    const { info, dark2 } = darkTheme.palette;
    const currentRoute = this.getroute();
    let selectedKeys;
    if (currentRoute.includes('wallet')) {
      selectedKeys = ['wallet'];
    } else if (currentRoute.includes('nahmii')) {
      selectedKeys = ['nahmii'];
    } else if (currentRoute.includes('dex')) {
      selectedKeys = ['dex'];
    } else if (currentRoute.includes('settings')) {
      selectedKeys = ['settings'];
    }
    return (
      <SideBarLayout>
        <Sider>
          <SideBarMenu
            defaultSelectedKeys={[menuItems[0].key]}
            mode="inline"
            onSelect={this.handleChange}
            selectedKeys={selectedKeys}
            forceSubMenuRender
          >
            <Menu.Item key="/" className="menu-logo">
              <Link to="/">
                <div>
                  <img
                    className="anticon anticon-wallet logo-icon"
                    src={logoSrc}
                    alt="logo"
                  />
                </div>
              </Link>
            </Menu.Item>
            {menuItems &&
              menuItems.map((menuItem) => (
                <Menu.Item key={menuItem.key} className="menu-wallet">
                  <Link to={menuItem.to}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      {menuItem.icon === 'wallet' && (
                        <SvgIcon>
                          <path
                            d="M24,20 L24,21.3333333 C24,22.8 22.8,24 21.3333333,24 L2.66666667,24 C1.18666667,24 0,22.8 0,21.3333333 L0,2.66666667 C0,1.2 1.18666667,0 2.66666667,0 L21.3333333,0 C22.8,0 24,1.2 24,2.66666667 L24,4 L12,4 C10.52,4 9.33333333,5.2 9.33333333,6.66666667 L9.33333333,17.3333333 C9.33333333,18.8 10.52,20 12,20 L24,20 Z M12,17.3333333 L25.3333333,17.3333333 L25.3333333,6.66666667 L12,6.66666667 L12,17.3333333 Z M17.3333333,14 C16.2266667,14 15.3333333,13.1066667 15.3333333,12 C15.3333333,10.8933333 16.2266667,10 17.3333333,10 C18.44,10 19.3333333,10.8933333 19.3333333,12 C19.3333333,13.1066667 18.44,14 17.3333333,14 Z"
                            fill={
                              currentRoute === menuItem.to ||
                              currentRoute === '/wallet'
                                ? info
                                : dark2
                            }
                          />
                        </SvgIcon>
                      )}
                      {menuItem.icon === 'dex' && (
                      <SvgIcon viewBox="0 0 28 16">
                        <g
                          fill="none"
                          fillRule="evenodd"
                          transform="translate(-2 -8)"
                        >
                          <polygon points="0 0 32 0 32 32 0 32" />
                          <polygon
                            fill={currentRoute === menuItem.to ? info : dark2}
                            fillRule="nonzero"
                            points="21.333 8 24.387 11.053 17.88 17.56 12.547 12.227 2.667 22.12 4.547 24 12.547 16 17.88 21.333 26.28 12.947 29.333 16 29.333 8"
                          />
                        </g>
                      </SvgIcon>
                    )}
                      {menuItem.icon === 'nahmii-token' && (
                       currentRoute.includes('nahmii')
                       ?
                         <div>
                           <img alt="nahmii token" style={{ height: 'auto', width: '32px' }} src={NahmiiGreen} />
                         </div>
                      :
                         <div>
                           <img alt="nahmii token" style={{ height: 'auto', width: '32px' }} src={NahmiiGrey} />
                         </div>
                    )}
                    </div>
                  </Link>
                </Menu.Item>
                ))}
            <Menu.Item key="settings" className="menu-setting">
              <Link to="/settings">
                <div>
                  <Icon className="setting-icon" type="setting" />
                </div>
              </Link>
            </Menu.Item>
          </SideBarMenu>
        </Sider>
        {children}
      </SideBarLayout>
    );
  }
}
SideBar.propTypes = {
  /**
   * Array of menu items other than settings and logo
   */
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      to: PropTypes.string.isRequired,
    })
  ),
  /**
   * Source of logo
   */
  logoSrc: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  location: PropTypes.object,
};

export default withRouter(SideBar);

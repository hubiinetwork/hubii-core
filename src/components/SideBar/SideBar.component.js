import { Icon, Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import { SideBarLayout, SideBarMenu, MenuItemIcon } from './SideBar.style';

const { Sider } = Layout;

/**
 * Side bar component
 */

const SideBar = ({ menuItems, logoSrc, children }) => (
  <SideBarLayout style={{ minHeight: '100vh' }}>
    <Sider collapsed={true} collapsedWidth="72" trigger={null}>
      <SideBarMenu defaultSelectedKeys={['/']} mode="inline">
        <Menu.Item key="/" className="menu-logo">
          <Link to="/">
            <div>
              <img
                className="anticon anticon-wallet logo-icon"
                src={logoSrc}
                alt="logo"
              />
              <span>hubii core</span>
            </div>
          </Link>
        </Menu.Item>
        {menuItems &&
          menuItems.map(menuItem => (
            <Menu.Item key={menuItem.to} className="menu-wallet">
              <Link to={menuItem.to}>
                <div>
                  <MenuItemIcon type={menuItem.icon} />
                  <span>{menuItem.name}</span>
                </div>
              </Link>
            </Menu.Item>
          ))}
        <Menu.Item key="/settings" className="menu-setting">
          <Link to="/settings">
            <div>
              <Icon className="setting-icon" type="setting" />
              <span>Settings</span>
            </div>
          </Link>
        </Menu.Item>
      </SideBarMenu>
    </Sider>
    {children}
  </SideBarLayout>
);
SideBar.propTypes = {
  /**
   * Array of menu items other than settings and logo
   */
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      to: PropTypes.string.isRequired
    })
  ),
  /**
   * Source of logo
   */
  logoSrc: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

export default SideBar;

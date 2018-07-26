import { Icon, Layout, Menu } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import { SideBarLayout, SideBarMenu } from './SideBar.style';
import SvgIcon from '../ui/SvgIcon';
import darkTheme from '../../themes/darkTheme';

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
    return (
      <SideBarLayout style={{ minHeight: '100vh' }}>
        <Sider collapsed collapsedWidth="72" trigger={null}>
          <SideBarMenu
            defaultSelectedKeys={[menuItems[0].to]}
            mode="inline"
            onSelect={this.handleChange}
            selectedKeys={[currentRoute]}
          >
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
              menuItems.map((menuItem) => (
                <Menu.Item key={menuItem.to} className="menu-wallet">
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
                          fill={currentRoute === menuItem.to ? info : dark2}
                        />
                      </SvgIcon>
                    )}
                      {menuItem.icon === 'striim' && (
                      <SvgIcon viewBox="0 0 19 24">
                        <path
                          fill={currentRoute === menuItem.to ? info : dark2}
                          fillRule="evenodd"
                          d="M45.203125,184.421875 C45.203125,185.807299 44.8463577,187.052078 44.1328125,188.15625 C43.4192673,189.260422 42.3750069,190.124997 41,190.75 C39.6249931,191.375003 37.9948011,191.6875 36.109375,191.6875 C33.848947,191.6875 31.9843823,191.260421 30.515625,190.40625 C29.4739531,189.791664 28.6276074,188.971359 27.9765625,187.945312 C27.3255176,186.919266 27,185.92188 27,184.953125 C27,184.390622 27.1953105,183.908856 27.5859375,183.507812 C27.9765645,183.106769 28.4739553,182.90625 29.078125,182.90625 C29.5677108,182.90625 29.9817691,183.062498 30.3203125,183.375 C30.6588559,183.687502 30.9479155,184.151039 31.1875,184.765625 C31.4791681,185.494795 31.7942691,186.104164 32.1328125,186.59375 C32.4713559,187.083336 32.9479136,187.486978 33.5625,187.804688 C34.1770864,188.122397 34.98437,188.28125 35.984375,188.28125 C37.3593819,188.28125 38.4765582,187.960941 39.3359375,187.320312 C40.1953168,186.679684 40.625,185.880213 40.625,184.921875 C40.625,184.161455 40.3932315,183.544273 39.9296875,183.070312 C39.4661435,182.596352 38.8671912,182.234376 38.1328125,181.984375 C37.3984338,181.734374 36.4166728,181.468751 35.1875,181.1875 C33.5416584,180.802081 32.164068,180.351565 31.0546875,179.835938 C29.945307,179.32031 29.0651074,178.617192 28.4140625,177.726562 C27.7630176,176.835933 27.4375,175.729173 27.4375,174.40625 C27.4375,173.145827 27.7812466,172.026047 28.46875,171.046875 C29.1562534,170.067703 30.1510352,169.315107 31.453125,168.789062 C32.7552148,168.263018 34.2864495,168 36.046875,168 C37.453132,168 38.6692657,168.174477 39.6953125,168.523438 C40.7213593,168.872398 41.5729133,169.335935 42.25,169.914062 C42.9270867,170.49219 43.4218734,171.098955 43.734375,171.734375 C44.0468766,172.369795 44.203125,172.98958 44.203125,173.59375 C44.203125,174.145836 44.0078145,174.643227 43.6171875,175.085938 C43.2265605,175.528648 42.7395863,175.75 42.15625,175.75 C41.6249973,175.75 41.2213555,175.617189 40.9453125,175.351562 C40.6692695,175.085936 40.3697933,174.651045 40.046875,174.046875 C39.6302063,173.182287 39.1302113,172.507815 38.546875,172.023438 C37.9635387,171.53906 37.0260481,171.296875 35.734375,171.296875 C34.5364523,171.296875 33.5703162,171.559893 32.8359375,172.085938 C32.1015588,172.611982 31.734375,173.244788 31.734375,173.984375 C31.734375,174.442711 31.8593737,174.83854 32.109375,175.171875 C32.3593762,175.50521 32.7031228,175.791665 33.140625,176.03125 C33.5781272,176.270835 34.0208311,176.458333 34.46875,176.59375 C34.9166689,176.729167 35.6562448,176.927082 36.6875,177.1875 C37.9791731,177.489585 39.1484323,177.822915 40.1953125,178.1875 C41.2421927,178.552085 42.1328088,178.994789 42.8671875,179.515625 C43.6015662,180.036461 44.1744771,180.695309 44.5859375,181.492188 C44.9973979,182.289066 45.203125,183.265619 45.203125,184.421875 Z"
                          transform="translate(-27 -168)"
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
  }
}
SideBar.propTypes = {
  /**
   * Array of menu items other than settings and logo
   */
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
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

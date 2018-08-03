import { Layout, Menu, Icon } from 'antd';
import styled from 'styled-components';

const SideBarLayout = styled(Layout)`
  .ant-layout-sider {
    background-color: ${({ theme }) => theme.palette.dark};
  }
  .ant-layout-sider.ant-layout-sider-collapsed {
    width: 5.14rem !important;
    max-width: 5.14rem !important;
    min-width: 5.14rem !important;
  }
`;
const SideBarMenu = styled(Menu)`
  width: 5.14rem;
  border-right: none;
  background-color: ${({ theme }) => theme.palette.dark};
  .menu-logo {
    min-height: 5rem;
    margin: 0rem !important;
    padding: 0rem 1.07rem !important;
    .logo-icon {
      width: 3.07rem;
      margin-top: 1.07rem !important;
    }
  }
  .menu-wallet {
    min-height: 5rem;
    padding: 0rem 1.43rem !important;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .menu-setting {
    bottom: 0rem;
    width: 5.14rem;
    height: 5.14rem;
    line-height: 6.5rem;
    padding: 0rem 1.43rem !important;
    margin-bottom: 0rem !important;
    position: absolute !important;
    .setting-icon {
      font-size: 2.29rem !important;
    }
  }
  .ant-menu-item a {
    opacity: 0.6;
    color: ${({ theme }) => theme.palette.dark2};
  }
  .ant-menu-item a:hover {
    opacity: 1;
  }
  .ant-menu-item-selected a {
    opacity: 1;
    color: ${({ theme }) => theme.palette.info} !important;
  }
  .ant-menu-item.menu-logo a {
    opacity: 1;
    color: ${({ theme }) => theme.palette.dark2};
  }
  .ant-menu-item-selected {
    opacity: 1;
    color: ${({ theme }) => theme.palette.info};
    background: ${({ theme }) => theme.palette.dark1} !important;
    border-right: 0.14rem solid ${({ theme }) => theme.palette.info};
  }
  .ant-menu-item-selected.menu-logo {
    border-right: none;
    background: ${({ theme }) => theme.palette.dark} !important;
  }

  .ant-tooltip {
    display: none;
  }
`;

const MenuItemIcon = styled(Icon)`
  font-size: 2.29rem !important;
  line-height: 5rem !important;
`;
const Styledimg = styled.img`
  margin-top: 1.79rem;
  margin-left: 0.36rem;
`;

export { SideBarLayout, SideBarMenu, MenuItemIcon, Styledimg };

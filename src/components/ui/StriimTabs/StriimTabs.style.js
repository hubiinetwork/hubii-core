import { Tabs } from 'antd';
import styled from 'styled-components';

export default styled(Tabs)`
  margin-bottom: 0px;
  flex: 1;
  
  .ant-tabs-nav-container {
    border: 1px solid ${({ theme }) => theme.palette.light};
    border-radius: 4px;
    overflow: visible;
  }

  .ant-tabs-nav-scroll {
    display: flex;
    flex: 1;
  }

  .ant-tabs-bar {
    border-bottom: 0px solid ${({ theme }) => theme.palette.light};
  }

  .ant-tabs-nav .ant-tabs-tab {
    margin: 0 0px 0 0 !important;
    padding: 6px 20px !important;
    color: ${({ theme }) => theme.palette.light};
    font-family: 'SF Text';
    font-size: 11px;
    font-weight: 500;
    line-height: ${(props) => props.size === 'large' ? '18px' : '13px'};
    flex: 1;
    display: flex;
    justify-content: center;
    border-right: 1px solid ${({ theme }) => theme.palette.light};
    &:last-child {
      border-right: 0;
    }
  }

  .ant-tabs-nav-wrap {
    margin: 0px;
  }

  .ant-tabs-tab span i {
    top: 2px;
    color: ${({ theme }) => theme.palette.secondary};
    position: relative;
    font-size: 20px !important;
  }

  .ant-tabs-tab-active span i {
    color: ${({ theme }) => theme.palette.info};
  }

  .ant-tabs-nav .ant-tabs-tab-active {
    color: ${({ theme }) => theme.palette.light};
  }

  .ant-tabs-nav {
    display: flex;
    flex: 1;
  }

  .ant-tabs-tab-active.ant-tabs-tab {
    background-color: ${({ theme }) => theme.palette.light};
    color: ${({ theme }) => theme.palette.primary1};
  }

  .ant-tabs-tab-active.ant-tabs-tab:hover {
    color: ${({ theme }) => theme.palette.primary1};
    background-color: ${({ theme }) => theme.palette.light};
  }

  .ant-tabs-ink-bar {
    background-color: transparent;
  }
`;
export const TabPane = Tabs.TabPane;

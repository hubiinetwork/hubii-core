import { Tabs } from 'antd';
import styled from 'styled-components';

export default styled(Tabs)`
  margin-bottom: 0rem;
  flex: 1;
  
  .ant-tabs-nav-container {
    border: 0.07rem solid ${({ theme }) => theme.palette.light};
    border-radius: 0.29rem;
    overflow: visible;
  }

  .ant-tabs-nav-scroll {
    display: flex;
    flex: 1;
  }

  .ant-tabs-bar {
    border-bottom: 0rem solid ${({ theme }) => theme.palette.light};
  }

  .ant-tabs-nav .ant-tabs-tab {
    margin: 0 0rem 0 0 !important;
    padding: 0.43rem 1.43rem !important;
    color: ${({ theme }) => theme.palette.light};
    font-size: 0.79rem;
    font-weight: 400;
    line-height: ${(props) => props.size === 'large' ? '1.29rem' : '0.93rem'};
    flex: 1;
    display: flex;
    justify-content: center;
    border-right: 0.07rem solid ${({ theme }) => theme.palette.light};
    &:last-child {
      border-right: 0;
    }
  }

  .ant-tabs-nav-wrap {
    margin: 0rem;
  }

  .ant-tabs-tab span i {
    top: 0.14rem;
    color: ${({ theme }) => theme.palette.secondary};
    position: relative;
    font-size: 1.43rem !important;
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

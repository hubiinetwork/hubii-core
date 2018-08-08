import { Tabs } from 'antd';
import styled from 'styled-components';

export default styled(Tabs)`
  margin-bottom: 0rem;
  flex: 1;
  .ant-tabs-nav .ant-tabs-tab {
    margin: 0 0rem 0 0 !important;
    padding: 0.86rem 1.14rem !important;
    color: ${({ theme }) => theme.palette.secondary1};
  }
  .ant-tabs-nav-scroll {
    padding: 0rem 0.71rem;
    background: ${({ theme }) => theme.palette.primary3};
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
  .ant-tabs-nav .ant-tabs-tab:hover {
    color: ${({ theme }) => theme.palette.secondary1};
    background: ${({ theme }) => theme.palette.info1};
    height: 100%;
  }
  .ant-tabs-nav .ant-tabs-tab-active {
    color: ${({ theme }) => theme.palette.light};
  }

  .ant-tabs-tab-active.ant-tabs-tab:hover {
    color: ${({ theme }) => theme.palette.light};
  }
  .ant-tabs-ink-bar {
    background-color: ${({ theme }) => theme.palette.info};
  }
  .ant-tabs-content {
    padding: 0rem 1.86rem;
  }
  svg {
    margin-right: 0.64rem;
    
  }
`;

import { Tabs } from 'antd';
import styled from 'styled-components';

export default styled(Tabs)`
  margin-bottom: 0px;
  flex: 1;
  .ant-tabs-nav .ant-tabs-tab {
    margin: 0 0px 0 0 !important;
    padding: 12px 16px !important;
    color: ${({ theme }) => theme.palette.secondary1};
  }
  .ant-tabs-nav-scroll {
    padding: 0px 10px;
    background: ${({ theme }) => theme.palette.primary3};
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
  .ant-tabs-nav .ant-tabs-tab:hover {
     color: ${({ theme }) => theme.palette.secondary1};
     background: ${({ theme }) => theme.palette.info1};
     height: 3.55rem;
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
    padding: 0px 26px;
  }
  svg {
    margin-right: 0.64rem;
    
  }
`;

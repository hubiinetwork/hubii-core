import { Tabs } from 'antd';
import styled from 'styled-components';


export default styled(Tabs)`
&&&& {
  margin-bottom: 0;
  flex: 1;
  .ant-tabs-nav .ant-tabs-tab {
    margin: 0;
    padding: 0.86rem 1.14rem;
    height: 3.36rem;
    color: ${({ theme }) => theme.palette.secondary1};
  }
  .ant-tabs-nav-scroll {
    padding: 0 0.71rem;
    background: ${({ theme }) => theme.palette.primary3};
  }
  .ant-tabs-nav-wrap {
    margin: 0;
  }
  .ant-tabs-tab span i {
    top: 0.14rem;
    color: ${({ theme }) => theme.palette.secondary};
    position: relative;
    font-size: 1.43rem;
  }
  .ant-tabs-tab-active span i {
    color: ${({ theme }) => theme.palette.info};
  }
  .ant-tabs-nav .ant-tabs-tab:hover {
    color: ${({ theme }) => theme.palette.secondary1};
    background: ${({ theme }) => theme.palette.info1};
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
  svg {
    margin-right: 0.64rem;
  }
}
`;

export const TabPane = Tabs.TabPane;

import { Tabs } from 'antd';
import styled from 'styled-components';


export default styled(Tabs)`
&&&& {
  ${(props) => `
    margin-bottom: 0;
    flex: 1;
    .ant-tabs-nav .ant-tabs-tab {
      margin: 0;
      padding: 0.86rem 1.14rem;
      height: 3.36rem;
      color: ${props.theme.palette.secondary1};
    }
    .ant-tabs-nav-scroll {
      padding: 0 0.71rem;
      background: ${props.theme.palette.primary3};
    }
    .ant-tabs-nav-wrap {
      margin: 0;
    }
    .ant-tabs-tab span i {
      top: 0.14rem;
      color: ${props.theme.palette.secondary};
      position: relative;
      font-size: 1.43rem;
    }
    .ant-tabs-tab-active span i {
      color: ${props.theme.palette.info};
    }
    .ant-tabs-nav .ant-tabs-tab:hover {
      color: ${props.theme.palette.secondary1};
      background: ${props.theme.palette.info1};
    }
    .ant-tabs-nav .ant-tabs-tab-active {
      color: ${props.theme.palette.light};
    }

    .ant-tabs-tab-active.ant-tabs-tab:hover {
      color: ${props.theme.palette.light};
    }
    .ant-tabs-ink-bar {
      background-color: ${props.theme.palette.info};
    }
    .ant-tabs-content {
      padding: ${props.noPadding ? '0 0' : '0 1.86rem'};
    }
    svg {
      margin-right: 0.64rem;
    }
    .ant-tabs-bar {
      ${props.noPadding ? 'margin: 0' : ''};
    }
  `}
}
`;

export const TabPane = Tabs.TabPane;

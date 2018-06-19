import styled from 'styled-components';
import { Collapse } from 'antd';

const Panel = Collapse.Panel;

const AdvanceSettingsHeader = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.palette.info};
`;

const styledCollapse = styled(Collapse)`
  background: transparent;
  margin-left: -15px;
  .ant-collapse-header {
    color: ${({ theme }) => theme.palette.info} !important;
  }
  .ant-collapse-item {
    border-bottom: none !important;
  }
  .ant-collapse-content {
    padding-right: 0px !important;
  }
  .ant-collapse-content-box {
    padding-right: 0px !important;
  }
`;

export { styledCollapse as Collapse, Panel, AdvanceSettingsHeader };

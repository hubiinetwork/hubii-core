import styled from 'styled-components';
import { Row, Collapse } from 'antd';


export const Image = styled.div`
border-bottom: 1px solid ${({ theme }) => theme.palette.secondary};
padding-bottom: 4px;
`;

export const ETHtoDollar = styled.span`
font-size: 12px;
color: ${({ theme }) => theme.palette.secondary};
`;

const StyledRow = styled(Row)`
margin-top: 30px;
.ant-row-flex-top {
  margin-top: 16px;
}
`;
export const StyledLabel = styled.span`
color: ${({ theme }) => theme.palette.info};
font-weight: bold;
`;

export const Panel = Collapse.Panel;

export const AdvanceSettingsHeader = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.palette.info};
`;

export const styledCollapse = styled(Collapse)`
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

export { styledCollapse as Collapse, StyledRow as Row };
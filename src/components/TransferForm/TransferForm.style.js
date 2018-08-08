import styled from 'styled-components';
import { Row, Collapse } from 'antd';
import Select from 'components/ui/Select';
import Button from '../../components/ui/Button';

export const StyledSelect = styled(Select)`
  .ant-select-selection{
    box-shadow: none;
  }
`;

export const StyledButton = styled(Button)`
  margin-left: auto;
  border-width: 2px;
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
`;

export const Image = styled.img`
  width: 2.35rem;
  height: 2.35rem;
  border-bottom: 0.07rem solid ${({ theme }) => theme.palette.secondary};
  padding-bottom: 0.29rem;
`;

export const ETHtoDollar = styled.span`
  font-size: 0.86rem;
  color: ${({ theme }) => theme.palette.secondary};
`;

const StyledRow = styled(Row)`
margin-top: 2.14rem;
.ant-row-flex-top {
  margin-top: 1.14rem;
}
`;
export const StyledLabel = styled.span`
color: ${({ theme }) => theme.palette.info};
font-weight: bold;
`;

export const Panel = Collapse.Panel;

export const AdvanceSettingsHeader = styled.span`
  font-size: 1rem;
  color: ${({ theme }) => theme.palette.info};
`;

export const styledCollapse = styled(Collapse)`
  background: transparent;
  margin-left: -1.07rem;
  .ant-collapse-header {
    color: ${({ theme }) => theme.palette.info} !important;
  }
  .ant-collapse-item {
    border-bottom: none !important;
  }
  .ant-collapse-content {
    padding-right: 0rem !important;
  }
  .ant-collapse-header{
    width: fit-content;
  }
  .ant-collapse-content-box {
    padding-right: 0rem !important;
  }
`;

export { styledCollapse as Collapse, StyledRow as Row };

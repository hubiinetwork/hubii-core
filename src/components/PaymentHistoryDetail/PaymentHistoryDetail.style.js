import styled from 'styled-components';
import { Collapse } from 'antd';
const Panel = Collapse.Panel;

export const PaymentHistoryType = styled.div`
  color: ${({ theme }) => theme.palette.light};
  font-weight: bolder;
  display: flex;
`;

export const TimePast = styled.div`
  color: ${({ theme }) => theme.palette.secondary4};
  font-weight: bolder;
`;

export const CollapseLeft = styled.div`
  border-right: 1px solid ${({ theme }) => theme.palette.secondary4};
  margin-top: 1rem;
  flex: 0.7;
`;

export const CollapseRight = styled.div`
  flex: 0.3;
  margin-top: 1rem;
  margin-left: 1rem;
`;

export const CollapseParent = styled.div`
  display: flex;
  flex: 1;
`;

export const Amount = styled.div`
  color: ${({ theme }) => theme.palette.secondary1};
  font-weight: bolder;
`;

export const PaymentHistoryAddress = styled.div`
  word-break: break-all;
  color: ${({ theme }) => theme.palette.info};
  margin-left: 3px;
  font-weight: bolder;
  margin-right: 3px;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: space-around;
`;

export const DetailCollapse = styled(Collapse)`
  border-width: 0px;
  padding: 0px;
  background-color: transparent;
  flex: 1;
  display: flex;
  align-items: center;
  .ant-collapse-header {
    padding: 0px !important;
  }
  .ant-collapse-content {
    padding-left: 0px !important;
  }
  .ant-collapse-content-box {
    padding-top: 8px !important;
    padding: 0px !important;
  }
`;

export const DetailPanel = styled(Panel)`
  padding: 0px;
  flex: 1;
  .ant-collapse-header {
    flex: 1;
    &:focus {
      border: 0px solid red;
    }
  }
`;

export const TextGrey = styled.div`
  color: ${({ theme }) => theme.palette.secondary1};
  margin-bottom: 0px;
  margin-right: 5px;
  font-weight: bolder;
`;

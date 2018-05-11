import styled from 'styled-components';
import { Collapse } from 'antd';
const Panel = Collapse.Panel;

export const TransactionHistoryType = styled.div`
  color: ${({ theme }) => theme.palette.light};
  font-weight: bolder;
  margin-right: 10px;
`;

export const TransactionHistoryAddress = styled.div`
  word-break: break-all;
  color: ${({ theme }) => theme.palette.info};
  margin-left: 3px;
  margin-right: 3px;
`;

export const TransactionHistoryAddressLink = styled.a`
  color: ${({ theme }) => theme.palette.info};
  word-break: break-all;
  &:active {
    color: ${({ theme }) => theme.palette.info};
  }
  &:hover {
    color: ${({ theme }) => theme.palette.info};
    text-decoration: underline;
  }
  &:focus {
    color: ${({ theme }) => theme.palette.info};
  }
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  margin-left: 10px;
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
    padding-bottom: 0px !important;
  }
`;

export const DetailPanel = styled(Panel)`
  padding: 0px;
`;

export const HashText = styled.div`
  color: ${({ theme }) => theme.palette.secondary1};
  margin-bottom: 0px;
  margin-right: 5px;
`;

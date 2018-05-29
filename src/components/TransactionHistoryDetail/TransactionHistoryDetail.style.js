import styled from 'styled-components';
import { Collapse, Icon } from 'antd';
const Panel = Collapse.Panel;

export const TransactionHistoryType = styled.div`
  color: ${({ theme }) => theme.palette.light};
  font-family: 'SF Text';
  font-size: 14px;
`;

export const TransactionStatus = styled.div`
  color: ${({ theme }) => theme.palette.light};
  font-family: 'SF Text';
  font-size: 12px;
`;

export const TransactionHistoryItemCardIcon = styled(Icon)`
  color: ${({ theme }) => theme.palette.success1};
  font-size: 20px;
  display: flex;
  align-items: center;
  margin-right: 9px;
`;

export const Amount = styled.div`
  color: ${({ theme }) => theme.palette.secondary1};
  font-size: 12px;
  font-family: 'SF Text';
  margin-left: 15px;
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

export const TransactionHistoryAddress = styled.div`
  word-break: break-all;
  color: ${({ theme }) => theme.palette.info};
  margin-left: 3px;
  font-family: 'SF Text';
  margin-right: 3px;
`;

export const TransactionHistoryAddressLink = styled.a`
  color: ${({ theme }) => theme.palette.secondary};
  font-family: 'SF Text';
  font-size: 12px;
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
`;

export const HashText = styled.div`
  color: ${({ theme }) => theme.palette.secondary1};
  margin-bottom: 0px;
  margin-right: 5px;
  font-weight: bolder;
`;

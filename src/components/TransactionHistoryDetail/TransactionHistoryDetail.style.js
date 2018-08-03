import styled from 'styled-components';
import { Collapse, Icon } from 'antd';
const Panel = Collapse.Panel;

export const TransactionHistoryType = styled.div`
  color: ${({ theme }) => theme.palette.light};
  font-family: 'SF Text';
  font-size: 1rem;
`;

export const TransactionStatus = styled.div`
  color: ${({ theme }) => theme.palette.light};
  font-family: 'SF Text';
  font-size: 0.86rem;
`;

export const TransactionHistoryItemCardIcon = styled(Icon)`
  color: ${({ theme }) => theme.palette.light};
  font-size: 1.43rem;
  display: flex;
  align-items: center;
  margin-right: 0.64rem;
`;

export const Amount = styled.div`
  color: ${({ theme }) => theme.palette.secondary1};
  font-size: 0.86rem;
  font-family: 'SF Text';
  margin-left: 1.07rem;
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

export const TransactionHistoryAddress = styled.div`
  word-break: break-all;
  color: ${({ theme }) => theme.palette.info};
  margin-left: 0.21rem;
  font-family: 'SF Text';
  margin-right: 0.21rem;
`;

export const TransactionHistoryAddressLink = styled.a`
  color: ${({ theme }) => theme.palette.secondary};
  font-family: 'SF Text';
  font-size: 0.86rem;
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
  border-width: 0rem;
  padding: 0rem;
  background-color: transparent;
  flex: 1;
  display: flex;
  align-items: center;
  .ant-collapse-header {
    padding: 0rem !important;
  }
  .ant-collapse-content {
    padding-left: 0rem !important;
  }
  .ant-collapse-content-box {
    padding-top: 0.57rem !important;
    padding: 0rem !important;
  }
`;

export const DetailPanel = styled(Panel)`
  padding: 0rem;
  flex: 1;
`;

export const HashText = styled.div`
  color: ${({ theme }) => theme.palette.secondary1};
  margin-bottom: 0rem;
  margin-right: 0.36rem;
  font-weight: bolder;
`;

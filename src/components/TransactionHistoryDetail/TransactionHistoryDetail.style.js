import styled from 'styled-components';
import { Collapse, Icon } from 'antd';
const Panel = Collapse.Panel;

export const TypeText = styled.div`
  color: ${({ theme }) => theme.palette.light};
  margin-right: 0.29rem;
  font-size: 1rem;
`;

export const TransactionStatus = styled.span`
  color: ${({ theme }) => theme.palette.light};
  font-size: 0.86rem;
`;

export const TypeIcon = styled(Icon)`
  color: ${({ theme }) => theme.palette.light};
  font-size: 1.43rem;
  display: flex;
  align-items: center;
  margin-right: 0.64rem;
`;

export const FiatValue = styled.div`
  color: ${({ theme }) => theme.palette.secondary1};
  font-size: 0.86rem;
  margin-left: 0.5rem;
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
  flex: 1; 
`;

export const GreenTextWrapper = styled.span`
  word-break: break-all;
  color: ${({ theme }) => theme.palette.info};
`;

export const TransactionId = styled.a`
  color: ${({ theme }) => theme.palette.secondary};
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
    padding-left: 0 !important;
    padding-right: 0 !important;
    padding-top: 0.14rem !important;
    padding-bottom: 0.14rem !important;
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

export const Amount = styled.span`
  font-size: 14px;
  word-break: break-all;
  color: ${({ theme }) => theme.palette.success};
`;

export const TransactionHistoryTime = styled.span`
  color: ${({ theme }) => theme.palette.secondary1};
  font-size: 12px;
  margin-left: 1rem;
`;

export const DetailsWrapper = styled.div`
  display: flex;
  margin-right: 10px;
`;

import { Icon } from 'antd';
import styled from 'styled-components';

export const TransactionHistoryItemCard = styled.div`
  background-color: ${({ theme }) => theme.palette.primary4};
  padding: 5px;
  border-radius: 26px;
  flex: 1;
  display: flex;
  box-shadow: ${({ theme }) => theme.shadows.light};
`;
export const TransactionHistoryItemDate = styled.span`
  color: ${({ theme }) => theme.palette.light};
  margin-right: 10px;
  max-width: 25px;
  text-align: center;
  font-weight: 550;
  font-size: 12px;
`;
export const SpaceAround = styled.div`
  margin-right: 10px;
  display: flex;
  justify-content: space-around;
`;

export const Image = styled.img`
  height: 32px;
  width: 32px;
  display: flex;
  align-self: center;
`;

export const TransactionHistoryItemCardIcon = styled(Icon)`
  color: ${({ theme }) => theme.palette.success1};
  font-size: 28px;
  display: flex;
  align-items: center;
  margin-left: 10px;
`;

export const TransactionHistoryTime = styled.span`
  color: ${({ theme }) => theme.palette.secondary1};
  font-size: 10px;
  min-width: 65px;
`;

export const TransactionHistoryConversion = styled.span`
  font-size: 12px;
  width: 65px;
  word-break: break-all;
  color: ${({ theme }) => theme.palette.success};
`;

export const Wrapper = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

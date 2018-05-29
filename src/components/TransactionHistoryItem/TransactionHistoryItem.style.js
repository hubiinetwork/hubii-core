import styled from 'styled-components';

export const TransactionHistoryItemCard = styled.div`
  background-color: ${({ theme }) => theme.palette.primary4};
  padding: 5px;
  align-items: center;
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
  font-family: 'SF Text';
  font-size: 15px;
  font-weight: 600;
`;

export const Received = styled.div`
  color: ${({ theme }) => theme.palette.info} !important;
  font-family: 'SF Text';
`;

export const Sent = styled.div`
  color: ${({ theme }) => theme.palette.warning} !important;
  font-family: 'SF Text';
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
  margin-right: 9px;
  align-self: flex-start;
`;

export const TransactionHistoryTime = styled.span`
  color: ${({ theme }) => theme.palette.secondary1};
  font-size: 12px;
  min-width: 65px;
  font-family: 'SF Text';
`;

export const TransactionHistoryConversion = styled.span`
  font-size: 14px;
  width: 65px;
  font-family: 'SF Text';
  word-break: break-all;
  color: ${({ theme }) => theme.palette.success};
`;

export const Wrapper = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

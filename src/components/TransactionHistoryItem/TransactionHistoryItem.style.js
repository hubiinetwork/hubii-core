import styled from 'styled-components';

export const TransactionHistoryItemCard = styled.div`
  background-color: ${({ theme }) => theme.palette.primary4};
  padding: 5px;
  align-items: center;
  border-radius: 20px;
  flex: 1;
  display: flex;
  box-shadow: ${({ theme }) => theme.shadows.light};
`;

export const Received = styled.div`
  color: ${({ theme }) => theme.palette.info} !important;
  font-family: 'SF Text';
`;

export const Sent = styled.div`
  color: ${({ theme }) => theme.palette.warning} !important;
  font-family: 'SF Text';
`;

export const Image = styled.img`
  display: flex;
  align-self: flex-start;
  align-items: center;
  height: 26px;
  width: 26px;
  margin-right: 9px;
`;

export const Wrapper = styled.div`
  display: flex;
  margin-bottom: 16px;
  align-items: center;
`;

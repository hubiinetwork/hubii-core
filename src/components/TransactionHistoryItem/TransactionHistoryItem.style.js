import styled from 'styled-components';

export const TransactionHistoryItemCard = styled.div`
  background-color: ${({ theme }) => theme.palette.primary4};
  padding: 0.36rem;
  align-items: center;
  border-radius: 1.43rem;
  flex: 1;
  display: flex;
  box-shadow: ${({ theme }) => theme.shadows.light};
`;

export const Received = styled.div`
  color: ${({ theme }) => theme.palette.info} !important;
`;

export const Sent = styled.div`
  color: ${({ theme }) => theme.palette.warning} !important;
`;

export const Image = styled.img`
  display: flex;
  align-self: flex-start;
  align-items: center;
  height: 1.86rem;
  width: 1.86rem;
  margin-right: 0.64rem;
`;

export const Wrapper = styled.div`
  display: flex;
  margin-bottom: 1.14rem;
  align-items: center;
`;

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
export const TransactionHistoryItemDate = styled.span`
  color: ${({ theme }) => theme.palette.light};
  margin-right: 0.86rem;
  max-width: 1.79rem;
  text-transform: uppercase;
  text-align: center;
  display: flex;
  align-self: baseline;
  justify-content: center;
  line-height: 1.14rem;
  font-size: 1.21rem;
  font-weight: 500;
  margin-top: 0.29rem;
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
  margin-right: 0.71rem;
  display: flex;
  justify-content: space-around;
`;

export const Image = styled.img`
  height: 1.71rem;
  width: 1.71rem;
  display: flex;
  margin-right: 0.64rem;
  align-self: flex-start;
`;

export const TransactionHistoryTime = styled.span`
  color: ${({ theme }) => theme.palette.secondary1};
  font-size: 0.86rem;
  min-width: 4.64rem;
  font-family: 'SF Text';
`;

export const TransactionHistoryConversion = styled.span`
  font-size: 1rem;
  width: 4.64rem;
  font-family: 'SF Text';
  word-break: break-all;
  color: ${({ theme }) => theme.palette.success};
`;

export const Wrapper = styled.div`
  display: flex;
  margin-bottom: 1.14rem;
  align-items: center;
`;

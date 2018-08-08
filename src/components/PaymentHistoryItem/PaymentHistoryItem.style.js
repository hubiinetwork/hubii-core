import styled from 'styled-components';

export const PaymentHistoryItemCard = styled.div`
  background-color: ${({ theme }) => theme.palette.primary4};
  padding: 0.36rem;
  border-radius: 1.21rem;
  flex: 1;
  display: flex;
  box-shadow: ${({ theme }) => theme.shadows.light};
`;

export const Image = styled.img`
  height: 1.71rem;
  width: 1.71rem;
  display: flex;
  margin-right: 0.64rem;
  align-self: flex-start;
`;

export const Wrapper = styled.div`
  display: flex;
  margin-bottom: 1.14rem;
`;

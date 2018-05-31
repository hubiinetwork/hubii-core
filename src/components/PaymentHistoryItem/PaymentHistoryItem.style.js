import styled from 'styled-components';

export const PaymentHistoryItemCard = styled.div`
  background-color: ${({ theme }) => theme.palette.primary4};
  padding: 5px;
  border-radius: 17px;
  flex: 1;
  display: flex;
  box-shadow: ${({ theme }) => theme.shadows.light};
`;

export const Image = styled.img`
  height: 24px;
  width: 24px;
  display: flex;
  margin-right: 9px;
  align-self: flex-start;
`;

export const Wrapper = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

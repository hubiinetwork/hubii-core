import styled from 'styled-components';

export const PaymentHistoryItemCard = styled.div`
  background-color: ${({ theme }) => theme.palette.primary4};
  padding: 5px;
  border-radius: 26px;
  flex: 1;
  display: flex;
  box-shadow: ${({ theme }) => theme.shadows.light};
`;

export const Image = styled.img`
  height: 32px;
  width: 32px;
  display: flex;
  margin-right: 9px;
`;

export const Wrapper = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

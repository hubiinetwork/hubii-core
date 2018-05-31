import styled from 'styled-components';

export const PaymentTypes = styled.div`
  height: 22px;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 50px;
  color: ${({ disabled: secondary1 }) => {
    if (secondary1 === true) {
      return ({ theme }) => theme.palette.secondary;
    } else {
      return ({ theme }) => theme.palette.light;
    }
  }};
  background-color: ${({ type: payment, disabled: secondary }) => {
    if (secondary === true) {
      return ({ theme }) => theme.palette.secondary4;
    } else if ((payment === 'Orders') | (payment === 'Order')) {
      return ({ theme }) => theme.palette.primary6;
    } else if ((payment === 'Trades') | (payment === 'Trade')) {
      return ({ theme }) => theme.palette.danger;
    } else if ((payment === 'Payments') | (payment === 'Payment')) {
      return ({ theme }) => theme.palette.dark1;
    } else if ((payment === 'Withdrawals') | (payment === 'Withdrawal')) {
      return ({ theme }) => theme.palette.warning;
    } else if ((payment === 'Deposits') | (payment === 'Deposit')) {
      return ({ theme }) => theme.palette.success;
    }
  }};
`;

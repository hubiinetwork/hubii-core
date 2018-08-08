import styled from 'styled-components';

export const PaymentTypes = styled.div`
  height: 1.57rem;
  padding-left: 1.43rem;
  padding-right: 1.43rem;
  border-radius: 3.57rem;
  color: ${({ disabled: secondary1 }) => {
    if (secondary1 === true) {
      return ({ theme }) => theme.palette.secondary;
    }
    return ({ theme }) => theme.palette.light;
  }};
  background-color: ${({ type: payment, disabled: secondary, theme }) => {
    if (secondary === true) {
      return theme.palette.secondary4;
    } else if ((payment === 'Orders') || (payment === 'Order')) {
      return theme.palette.primary6;
    } else if ((payment === 'Trades') || (payment === 'Trade')) {
      return theme.palette.danger;
    } else if ((payment === 'Payments') || (payment === 'Payment')) {
      return theme.palette.dark1;
    } else if ((payment === 'Withdrawals') || (payment === 'Withdrawal')) {
      return theme.palette.warning;
    } else if ((payment === 'Deposits') || (payment === 'Deposit')) {
      return theme.palette.success;
    }
    return '';
  }};
`;

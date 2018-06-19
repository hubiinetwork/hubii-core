import React from 'react';
import PropTypes from 'prop-types';
import { PaymentTypes } from './PaymentType.style';
/**
 * This component shows type of the Payment.
*/ const PaymentType = (props) => (
  <PaymentTypes type={props.type} disabled={props.disabled}>
    {props.type}
  </PaymentTypes>
);
PaymentType.propTypes = {
  /**
   * type of the payment.
   */
  type: PropTypes.oneOf([
    'Orders',
    'Trades',
    'Payments',
    'Withdrawals',
    'Deposits',
    'Order',
    'Trade',
    'Payment',
    'Withdrawal',
    'Deposit',
  ]).isRequired,
  /**
   * shows disbaled state if true.
   */
  disabled: PropTypes.bool,
};

export default PaymentType;

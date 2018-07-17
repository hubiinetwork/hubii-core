import React from 'react';
import PropTypes from 'prop-types';

const Price = (props) => (
  <span>
    {props.loading && 'Loading'}
    {props.error && 'No available'}
    {props.price && `$${(props.price * props.amount).toLocaleString('en', { currency: 'USD' })}`}
  </span>
);

Price.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.bool,
  price: PropTypes.number,
  amount: PropTypes.number,
};

export default Price;

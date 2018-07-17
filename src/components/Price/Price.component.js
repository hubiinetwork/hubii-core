import React from 'react';
import PropTypes from 'prop-types';
import { formatFiat } from '../../utils/numberFormats';

const Price = (props) => (
  <span>
    {props.loading && 'Loading'}
    {props.error && 'No available'}
    {props.price && `${formatFiat(props.price * props.amount, 'USD')}`}
  </span>
);

Price.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.bool,
  price: PropTypes.number,
  amount: PropTypes.number,
};

export default Price;

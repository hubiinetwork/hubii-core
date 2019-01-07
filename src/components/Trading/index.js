/**
*
* Trading
*
*/

import React from 'react';
import PropTypes from 'prop-types';

import CandleStickChart from 'components/CandleStickChart';

import {
  Container,
} from './style';


const Trading = (props) => (
  <div>
    <Container>
      <CandleStickChart
        priceHistory={props.priceHistory}
        latestPrice={props.latestPrice}
        currency={props.currency}
      />
    </Container>
  </div>
  );

Trading.propTypes = {
  priceHistory: PropTypes.object.isRequired,
  latestPrice: PropTypes.object.isRequired,
  currency: PropTypes.string.isRequired,
};

export default Trading;

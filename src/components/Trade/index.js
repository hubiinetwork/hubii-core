/**
 *
 * Trade
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Text from 'components/ui/Text';

import {
  Wrapper,
  Header,
  BuySellSwitch,
  SwitchWrapper,
} from './style';


export class Trade extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      changeIntendedTrade,
      intendedTrade,
      // executeTrade,
    } = this.props;
    return (
      <Wrapper className={this.props.className}>
        <Header>
          <Text large>Trade</Text>
          <SwitchWrapper>
            <Text>Buy</Text>
            &nbsp;&nbsp;
            <BuySellSwitch
              checked={intendedTrade.side === 'sell'}
              onChange={() => changeIntendedTrade({
                ...intendedTrade,
                side: intendedTrade.side === 'buy' ? 'sell' : 'buy',
              })}
            />
            &nbsp;&nbsp;
            <Text>Sell</Text>
          </SwitchWrapper>
        </Header>
      </Wrapper>
    );
  }
}

Trade.propTypes = {
  className: PropTypes.string,
  intendedTrade: PropTypes.shape({
    side: PropTypes.oneOf(['buy', 'sell']).isRequired,
    type: PropTypes.oneOf(['market', 'limit']).isRequired,
    volume: PropTypes.number.isRequired,
    price: PropTypes.number,
  }).isRequired,
  changeIntendedTrade: PropTypes.func.isRequired,
  // executeTrade: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(null, mapDispatchToProps);

export default compose(
  withConnect,
)(Trade);

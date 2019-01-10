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
import Button from 'components/ui/Button';
import Select, { Option } from 'components/ui/Select';

import {
  Wrapper,
  Header,
  BuySellSwitch,
  SwitchWrapper,
  StyledInput,
  InputWrapper,
  SummaryWrapper,
} from './style';


export class Trade extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      changeIntendedTrade,
      intendedTrade,
      executeTrade,
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
        <div>
          <Text>Avaliable: 0.01 HBT</Text>
          <InputWrapper>
            <Text>Type</Text>&nbsp;&nbsp;
            <Select
              style={{ marginTop: '1rem', width: '20rem' }}
              value={intendedTrade.type}
              onChange={(type) => changeIntendedTrade({ ...intendedTrade, type })}
            >
              <Option value="market">Market</Option>
              <Option value="limit">Limit</Option>
            </Select>
          </InputWrapper>
          <InputWrapper>
            <Text>Volume</Text>&nbsp;&nbsp;
            <StyledInput
              value={intendedTrade.volume}
              onChange={(e) => changeIntendedTrade({ ...intendedTrade, volume: e.target.value })}
              type={'number'}
              min={0}
            />
          </InputWrapper>
          <InputWrapper style={{ marginBottom: '1rem' }}>
            <Text>Price</Text>&nbsp;&nbsp;
            <StyledInput
              value={intendedTrade.type === 'limit' ? intendedTrade.price : 'Market price'}
              disabled={intendedTrade.type === 'market'}
              onChange={(e) => changeIntendedTrade({ ...intendedTrade, price: e.target.value })}
              type={intendedTrade.type === 'limit' && 'number'}
              min={0}
            />
          </InputWrapper>
          <SummaryWrapper>
            <Text>Spend Total: 0.01 HBT</Text>
            <Button
              type="primary"
              onClick={executeTrade}
            >
              Place Order
            </Button>
          </SummaryWrapper>
        </div>
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
  executeTrade: PropTypes.func.isRequired,
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

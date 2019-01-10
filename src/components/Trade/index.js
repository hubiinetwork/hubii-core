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
  constructor() {
    super();
    this.changeVolume = this.changeVolume.bind(this);
  }

  changeVolume(volume) {
    if (isNaN(volume) || volume < 0) return;
    const { changeIntendedTrade, intendedTrade } = this.props;
    changeIntendedTrade({ ...intendedTrade, volume });
  }

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
          <Text>Avaliable HBT: 0.01</Text>
          <InputWrapper>
            <Text>Type:</Text>&nbsp;&nbsp;
            <Select
              style={{ marginTop: '1rem', width: '12rem' }}
              value={intendedTrade.type}
              onChange={(type) => changeIntendedTrade({ ...intendedTrade, type })}
            >
              <Option value="market">Market</Option>
              <Option value="limit">Limit</Option>
            </Select>
          </InputWrapper>
          <InputWrapper>
            <Text>Volume:</Text>&nbsp;&nbsp;
            <StyledInput
              addonAfter={'ETH'}
              style={{ width: '12rem' }}
              value={intendedTrade.volume}
              onChange={(e) => this.changeVolume(e.target.value)}
            />
          </InputWrapper>
          <InputWrapper style={{ marginBottom: '1rem' }}>
            <Text>Price:</Text>&nbsp;&nbsp;
            <StyledInput
              value={intendedTrade.type === 'limit' ? intendedTrade.price : 'Market price'}
              disabled={intendedTrade.type === 'market'}
              onChange={(e) => changeIntendedTrade({ ...intendedTrade, price: e.target.value })}
              type={intendedTrade.type === 'limit' ? 'number' : 'string'}
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
    volume: PropTypes.string.isRequired,
    price: PropTypes.string,
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

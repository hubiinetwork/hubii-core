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
  Label,
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
      selectedMarket,
    } = this.props;
    const { side, type, volume, price } = intendedTrade;
    const { primary, secondary } = selectedMarket;
    return (
      <Wrapper className={this.props.className}>
        <Header>
          <Text large>Trade</Text>
          <SwitchWrapper>
            <Text>Buy</Text>
            &nbsp;&nbsp;
            <BuySellSwitch
              checked={side === 'sell'}
              onChange={() => changeIntendedTrade({
                ...intendedTrade,
                side: side === 'buy' ? 'sell' : 'buy',
              })}
            />
            &nbsp;&nbsp;
            <Text>Sell</Text>
          </SwitchWrapper>
        </Header>
        <div>
          <Label>{`Avaliable ${secondary}:`}</Label>&nbsp;<Text>0.01</Text>
          <InputWrapper>
            <Label>Type:</Label>&nbsp;&nbsp;
            <Select
              style={{ marginTop: '1rem', width: '12rem' }}
              value={type}
              onChange={(newType) => changeIntendedTrade({ ...intendedTrade, type: newType })}
            >
              <Option value="market">Market</Option>
              <Option value="limit">Limit</Option>
            </Select>
          </InputWrapper>
          <InputWrapper>
            <Label style={{ fontWeight: '600' }}>Volume:</Label>&nbsp;&nbsp;
            <StyledInput
              addonAfter={primary}
              style={{ width: '12rem' }}
              value={volume}
              onChange={(e) => this.changeVolume(e.target.value)}
            />
          </InputWrapper>
          <InputWrapper style={{ marginBottom: '1rem' }}>
            <Label>Price:</Label>&nbsp;&nbsp;
            <StyledInput
              value={type === 'limit' ? price : 'Market price'}
              disabled={type === 'market'}
              onChange={(e) => changeIntendedTrade({ ...intendedTrade, price: e.target.value })}
              type={type === 'limit' ? 'number' : 'string'}
              min={0}
            />
          </InputWrapper>
          <SummaryWrapper>
            <Label>{`${type === 'market' ? 'Estimated ' : ''} Total ${side === 'buy' ? 'Spend' : 'Receive'}:`}</Label>
            &nbsp;
            <Text>{`0.01 ${secondary}`}</Text>
            <Button
              style={{ marginLeft: 'auto' }}
              type="primary"
              onClick={executeTrade}
            >
              {`${side === 'buy' ? 'Buy' : 'Sell'} ${primary}`}
            </Button>
          </SummaryWrapper>
        </div>
      </Wrapper>
    );
  }
}

Trade.propTypes = {
  className: PropTypes.string,
  changeIntendedTrade: PropTypes.func.isRequired,
  executeTrade: PropTypes.func.isRequired,
  intendedTrade: PropTypes.shape({
    side: PropTypes.oneOf(['buy', 'sell']).isRequired,
    type: PropTypes.oneOf(['market', 'limit']).isRequired,
    volume: PropTypes.string.isRequired,
    price: PropTypes.string,
  }).isRequired,
  selectedMarket: PropTypes.shape({
    primary: PropTypes.string.isRequired,
    secondary: PropTypes.string.isRequired,
  }),
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

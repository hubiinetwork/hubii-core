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
    this.calcTotal = this.calcTotal.bind(this);
  }

  changeVolume(volume) {
    if (isNaN(volume) || volume < 0) return;
    const { changeIntendedTrade, intendedTrade } = this.props;
    changeIntendedTrade({ ...intendedTrade, volume });
  }

  calcTotal() {
    const { orderBook, intendedTrade } = this.props;
    const { side, type, volume, price } = intendedTrade;
    // check for any empty / invalid fields
    if (volume === '' || isNaN(volume) || (type === 'limit' && (price === '' || isNaN(price)))) {
      return 0;
    }
    if (type === 'limit') {
      return parseFloat(volume) * parseFloat(price);
    }
    if (type === 'market') {
      let estTotal = 0;
      let remainingVol = parseFloat(volume);
      let curBookIndex = 0;
      const book = orderBook[side === 'buy' ? 'asks' : 'bids'];
      while (parseFloat(remainingVol) > 0) {
        // check we don't overrun orderbook array
        if (curBookIndex > book.length - 1) return 0;

        const curOrder = book[curBookIndex];
        if (parseFloat(curOrder.amount) >= remainingVol) {
          estTotal += parseFloat(curOrder.price) * remainingVol;
          remainingVol = 0;
        } else {
          estTotal += parseFloat(curOrder.price) * parseFloat(curOrder.amount);
          remainingVol -= parseFloat(curOrder.amount);
        }
        curBookIndex += 1;
      }
      return estTotal;
    }
    return 0;
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
    const total = this.calcTotal();
    const disableBtn = total <= 0;

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
          <Label>{`Avaliable ${side === 'buy' ? secondary : primary}:`}</Label>&nbsp;<Text>0.01</Text>
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
              value={type === 'limit' ? price : 'Best market price'}
              disabled={type === 'market'}
              onChange={(e) => changeIntendedTrade({ ...intendedTrade, price: e.target.value })}
              type={type === 'limit' ? 'number' : 'string'}
              min={0}
            />
          </InputWrapper>
          <SummaryWrapper>
            <Label>{`${type === 'market' ? 'Estimated ' : ''} Total ${side === 'buy' ? 'Spend' : 'Receive'}:`}</Label>
            &nbsp;
            <Text>{`${total} ${secondary}`}</Text>
            <Button
              style={{ marginLeft: 'auto', width: '7rem' }}
              type="primary"
              onClick={executeTrade}
              disabled={disableBtn}
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
  orderBook: PropTypes.shape({
    bids: PropTypes.arrayOf(PropTypes.shape({
      price: PropTypes.string.isRequired,
      amount: PropTypes.string.isRequired,
    })).isRequired,
    asks: PropTypes.arrayOf(PropTypes.shape({
      price: PropTypes.string.isRequired,
      amount: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
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

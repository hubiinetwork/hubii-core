// import React from 'react';
// import { shallow } from 'enzyme';

// import { Trade } from '../index';

describe('<Trade />', () => {
  // let props;
  // beforeEach(() => {
  //   props = {
  //     className: 'TradeComponent',
  //     changeIntendedTrade: () => {},
  //     intendedTrade: {
  //       side: 'buy',
  //       type: 'market',
  //       volume: '0.0123',
  //       price: '123',
  //     },
  //     selectedMarket: {
  //       primary: 'ETH',
  //       secondary: 'HBT',
  //     },
  //   };
  // });
  it('should render correctly in buy mode', () => {
    expect(true).toEqual(false);
  });

  it('should render correctly in sell mode', () => {
    expect(true).toEqual(false);
  });

  it('should render correctly when type === market', () => {
    expect(true).toEqual(false);
  });

  it('should render correctly when type === limit', () => {
    expect(true).toEqual(false);
  });

  it('should correctly call func to change intendedTrade type', () => {

  });

  it('should correctly call func to change intendedTrade volume', () => {

  });

  it('should correctly call func to change intendedTrade price', () => {

  });

  it('should correctly switch between buy and sell', () => {

  });

  it('should disable the send button where appropriate', () => {

  });

  it('should correctly call func to execute trade', () => {

  });

  it('should add "Estimated" before "Total" for market trades', () => {

  });

  describe('calcTotal', () => {
    it('should correctly calc total', () => {

    });
    it('should return 0 if the orderbook is too shallow', () => {

    });
  });

  describe('changeVolume', () => {
    it('should correctly call changeIntendedTrade', () => {

    });
    it('shouldn\'t allow non-number volumes', () => {

    });
  });
});

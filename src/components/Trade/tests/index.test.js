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
    expect(true).toEqual(false);
  });

  it('should correctly call func to change intendedTrade volume', () => {
    expect(true).toEqual(false);
  });

  it('should correctly call func to change intendedTrade price', () => {
    expect(true).toEqual(false);
  });

  it('should correctly switch between buy and sell', () => {
    expect(true).toEqual(false);
  });

  it('should disable the send button where appropriate', () => {
    expect(true).toEqual(false);
  });

  it('should correctly call func to execute trade', () => {
    expect(true).toEqual(false);
  });

  it('should add "Estimated" before "Total" for market trades', () => {
    expect(true).toEqual(false);
  });

  describe('calcTotal', () => {
    it('should correctly calc total', () => {
      expect(true).toEqual(false);
    });
    it('should return 0 if the orderbook is too shallow', () => {
      expect(true).toEqual(false);
    });
  });

  describe('changeVolume', () => {
    it('should correctly call changeIntendedTrade', () => {
      expect(true).toEqual(false);
    });
    it('shouldn\'t allow non-number volumes', () => {
      expect(true).toEqual(false);
    });
  });
});

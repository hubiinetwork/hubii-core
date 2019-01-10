import styled from 'styled-components';
// import CandleStickChart from 'components/CandleStickChart';
import DepthChart from 'components/DepthChart';
import OrderBook from 'components/OrderBook';
import Markets from 'components/Markets';
import OrderHistory from 'components/OrderHistory';

const breakpoint = 'min-width: 1400px';

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  min-height: 90vh;
`;

export const PriceChartWrapper = styled.div`
  flex: 1;
  min-height: 30rem;
  flex-basis: 100%;
  background: red;
  margin: -0.1rem -0.4rem -0.25rem -0.5rem;
  z-index: 0;
  @media (${breakpoint}) {
    flex-basis: 66%;
    order: -2;
  }
`;

export const BookDepthChartWrapper = styled.div`
  display: flex;
  flex-basis: 50%;
  z-index: 1;
  height: 37.5rem;
  @media (${breakpoint}) {
    flex-basis: 33%;
    order: -1;
  }
`;

export const WrappedDepthChart = styled(DepthChart)`
  width: 150px;
  z-index: 1;
  background: ${({ theme }) => theme.palette.primary4};
  box-shadow: ${({ theme }) =>
    `inset 0 -1px 0 0 ${theme.palette.secondary7}, 
    inset 0 1px 0 0 ${theme.palette.dark1};`
  };
`;

export const WrappedOrderBook = styled(OrderBook)`
  display: flex;
  flex-grow: 1;
  flex-basis: 66%;
  box-shadow: ${({ theme }) =>
    `
    inset 0 -1px 0 0 ${theme.palette.secondary7}, 
    inset 1px 0 0 0 ${theme.palette.secondary7}, 
    inset 0 1px 0 0 ${theme.palette.dark1};`
  };
`;

export const WrappedMarkets = styled(Markets)`
  flex-basis: 50%;
  height: 30rem;
  z-index: 1;
  border-top: 1px solid ${({ theme }) => theme.palette.secondary7};
  border-right: 1px solid ${({ theme }) => theme.palette.secondary7};
  @media (${breakpoint}) {
    flex-basis: 27%;
  };
`;

export const WrappedOrders = styled(OrderHistory)`
  flex: 1;
  flex-basis: 50%;
  height: 30rem;
  z-index: 1;
  @media (${breakpoint}) {
    flex-basis: 40%;
  };
  border-top: 1px solid ${({ theme }) => theme.palette.secondary7};
  border-right: 1px solid ${({ theme }) => theme.palette.secondary7};
`;

export const Trading = styled.div`
  flex-basis: 50%;
  background: rosybrown;
  height: 30rem;
  z-index: 1;
  @media (${breakpoint}) {
    order: 1;
    flex-basis: 33%;
  }
`;

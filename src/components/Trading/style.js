import styled from 'styled-components';
// import CandleStickChart from 'components/CandleStickChart';
import DepthChart from 'components/DepthChart';
import OrderBook from 'components/OrderBook';

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
    flex-basis: 60%;
    order: -2;
  }
`;

export const BookDepthChartWrapper = styled.div`
  display: flex;
  flex-basis: 50%;
  z-index: 1;
  height: 37.5rem;
  @media (${breakpoint}) {
    flex-basis: 40%;
    order: -1;
  }
`;

export const WrappedDepthChart = styled(DepthChart)`
  width: 200px;
  z-index: 1;
  background: ${({ theme }) => theme.palette.primary4};
  box-shadow: ${({ theme }) =>
    `inset 0 -1px 0 0 ${theme.palette.secondary7}, 
    inset 0 1px 0 0 ${theme.palette.dark1};`
  }
`;

export const WrappedOrderBook = styled(OrderBook)`
  display: flex;
  flex-grow: 1;
  flex-basis: 66%;
  background: palevioletred;
`;

export const Markets = styled.div`
  flex-basis: 50%;
  background: yellow;
  height: 30rem;
  z-index: 1;
  @media (${breakpoint}) {
    flex-basis: 30%;
  }
`;

export const History = styled.div`
  flex: 1;
  flex-basis: 50%;
  background: burlywood;
  height: 30rem;
  z-index: 1;
  @media (${breakpoint}) {
    flex-basis: 30%;
  }
`;

export const Trading = styled.div`
  flex-basis: 50%;
  background: rosybrown;
  height: 30rem;
  z-index: 1;
  @media (${breakpoint}) {
    order: 1;
    flex-basis: 40%;
  }
`;

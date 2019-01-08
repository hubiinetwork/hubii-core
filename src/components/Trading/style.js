import styled from 'styled-components';
// import CandleStickChart from 'components/CandleStickChart';
import OrderBook from 'containers/OrderBook';

const breakpoint = 'min-width: 1400px';

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  min-height: 90vh;
`;

export const PriceChartWrapper = styled.div`
  flex: 1;
  flex-basis: 100%;
  height: 35rem;
  background: red;
  @media (${breakpoint}) {
    flex-basis: 60%;
    order: -2;
  }
`;

export const BookDepthChartWrapper = styled.div`
  display: flex;
  flex-basis: 50%;
  @media (${breakpoint}) {
    flex-basis: 40%;
    order: -1;
  }
`;

export const DepthChart = styled.div`
  flex-grow: 1;
  height: 35rem;
  background: green;
  flex-basis: 33%;
`;

export const WrappedOrderBook = styled(OrderBook)`
  display: flex;
  flex-grow: 1;
  height: 35rem;
  flex-basis: 66%;
  background: palevioletred;
`;

export const Markets = styled.div`
  flex-basis: 50%;
  background: yellow;
  height: 30rem;
  @media (${breakpoint}) {
    flex-basis: 30%;
  }
`;

export const History = styled.div`
  flex: 1;
  flex-basis: 50%;
  background: burlywood;
  height: 30rem;
  @media (${breakpoint}) {
    flex-basis: 30%;
  }
`;

export const Trading = styled.div`
  flex-basis: 50%;
  background: rosybrown;
  height: 30rem;
  @media (${breakpoint}) {
    order: 1;
    flex-basis: 40%;
  }
`;

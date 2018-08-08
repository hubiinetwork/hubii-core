import styled from 'styled-components';
import { Col } from 'antd';

import { media } from 'utils/style-utils';

import Transaction from 'components/Transaction';

export const WalletCardsCol = styled(Col)`
  margin-bottom: 1rem;
`;

export const StyledTransaction = styled(Transaction)`
  margin-bottom: 1rem !important;
`;

export const TransactionsWrapper = styled.div`
  max-width: 60rem;
  min-width: 40rem;
  ${media.tablet`
    max-width: 100rem;
  `}
  flex: 1;
`;

export const BreakdownWrapper = styled.div`
  display: flex;
  max-width: 50rem;
  min-width: 30rem;
  margin-left: 5rem;
  ${media.tablet`
    margin: 2rem 0;
  `}
  flex: 1;
`;

export const OuterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  ${media.tablet`
    flex-direction: column;
  `}
`;

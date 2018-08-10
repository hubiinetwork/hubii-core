import styled from 'styled-components';
import { Col, Pagination, Spin } from 'antd';

import { media } from 'utils/style-utils';

import Transaction from 'components/Transaction';

export const WalletCardsCol = styled(Col)`
  margin-bottom: 1rem;
`;

export const StyledTransaction = styled(Transaction)`
  margin-bottom: 1rem;
`;

export const StyledPagination = styled(Pagination)`
  margin-top: 1.5rem;
`;

export const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10rem;
`;

export const NoTxPlaceholder = styled.div`
  color: ${({ theme }) => theme.palette.secondary};
  font-size: 1.25rem;
  margin-top: 2rem;
  margin-left: 1rem;
`;

export const StyledSpin = styled(Spin)`
  color: ${({ theme }) => theme.palette.light}};
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

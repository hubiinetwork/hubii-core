import React from 'react';
import { shell } from 'electron';
import uuid from 'uuid/v4';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { EthNetworkProvider, getBreakdown } from 'utils/wallet';
import { formatFiat } from 'utils/numberFormats';

import Breakdown from 'components/Breakdown/Breakdown.component';
import { SectionHeading } from 'components/ui/SectionHeading';

import { makeSelectSupportedAssets, makeSelectCurrentWalletWithInfo } from 'containers/WalletHOC/selectors';

import { StyledTransaction, TransactionsWrapper, BreakdownWrapper, OuterWrapper, StyledPagination } from './style';

export class WalletsTransactions extends React.Component {
  constructor(props) {
    super(props);
    this.state = { currentPage: 1 };
    this.onPaginationChange = this.onPaginationChange.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if
    (
      (this.props.currentWalletWithInfo.getIn(['transactions', 'transactions']).size ===
      nextProps.currentWalletWithInfo.getIn(['transactions', 'transactions']).size) &&
      this.state.currentPage === nextState.currentPage
    ) return false;
    return true;
  }

  onPaginationChange(newPage) {
    this.setState({ currentPage: newPage });
  }


  render() {
    const { currentWalletWithInfo, supportedAssets } = this.props;
    const { currentPage } = this.state;

    const start = (currentPage - 1) * 10;
    const end = start + 10;
    const txToShow = currentWalletWithInfo.getIn(['transactions', 'transactions'])
      .toJS()
      .slice(start, end);

    if
    (
      currentWalletWithInfo.getIn(['balances', 'loading']) ||
      supportedAssets.get('loading') ||
      currentWalletWithInfo.getIn(['transactions', 'loading'])) {
      return <div>loading...</div>;
    }

    return (
      <OuterWrapper>
        <TransactionsWrapper>
          <SectionHeading>Transaction History</SectionHeading>
          {txToShow.map((tx) => (
            <StyledTransaction
              key={uuid()}
              time={new Date(tx.block.timestamp)}
              counterpartyAddress={tx.counterpartyAddress}
              amount={tx.decimalAmount}
              fiatEquivilent={formatFiat(tx.fiatValue, 'USD')}
              symbol={tx.symbol}
              confirmations={'-1'}
              type={tx.type}
              viewOnBlockExplorerClick={
                EthNetworkProvider.name === 'ropsten' ?
                  () => shell.openExternal(`https://ropsten.etherscan.io/tx/${tx.hash}`) :
                  () => shell.openExternal(`https://etherscan.io/tx/${tx.hash}`)
              }
            />
            )
            )}
          <StyledPagination
            total={currentWalletWithInfo.getIn(['transactions', 'transactions']).size}
            pageSize={10}
            defaultCurrent={currentPage}
            current={currentPage}
            onChange={this.onPaginationChange}
          />
        </TransactionsWrapper>
        <BreakdownWrapper>
          <Breakdown
            data={getBreakdown(currentWalletWithInfo.get('balances'), supportedAssets)}
            value={currentWalletWithInfo.getIn(['balances', 'total', 'usd']).toString()}
          />
        </BreakdownWrapper>
      </OuterWrapper>
    );
  }
}

WalletsTransactions.propTypes = {
  currentWalletWithInfo: PropTypes.object.isRequired,
  supportedAssets: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentWalletWithInfo: makeSelectCurrentWalletWithInfo(),
  supportedAssets: makeSelectSupportedAssets(),
});

export function mapDispatchToProps() {
  return {};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(WalletsTransactions);

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

import {
  makeSelectSupportedAssets,
  makeSelectCurrentWalletWithInfo,
  makeSelectBlockHeight,
} from 'containers/WalletHOC/selectors';

import { StyledTransaction, TransactionsWrapper, BreakdownWrapper, OuterWrapper, StyledPagination } from './style';

export class WalletsTransactions extends React.Component {
  constructor(props) {
    super(props);
    this.state = { currentPage: 1, expandedTxs: new Set() };
    this.onPaginationChange = this.onPaginationChange.bind(this);
    this.updateExpandedTx = this.updateExpandedTx.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    // By default every time we update this.state.expandedTxs it will trigger a re-render,
    // meaning we don't get a nice animation of the accordions expanding or collapsing.
    // Fix this by only updating only when required.
    if
    (
      (this.props.currentWalletWithInfo.getIn(['transactions', 'transactions']).size !==
      nextProps.currentWalletWithInfo.getIn(['transactions', 'transactions']).size) ||
      this.state.currentPage !== nextState.currentPage ||
      this.props.blockHeight.get('height') !== nextProps.blockHeight.get('height')
    ) return true;
    return false;
  }

  onPaginationChange(newPage) {
    this.setState({ currentPage: newPage });
  }

  // Every time this component rerenders it resets if a transaction is expanded or
  // collapsed. Keep track of which Transactions are expanded so we can pass in a
  // correct default state every render
  updateExpandedTx(id) {
    const { expandedTxs } = this.state;
    if (!expandedTxs.has(id)) {
      expandedTxs.add(id);
    } else {
      expandedTxs.delete(id);
    }
    this.setState({ expandedTxs });
  }


  render() {
    const { currentWalletWithInfo, supportedAssets } = this.props;
    const { expandedTxs, currentPage } = this.state;

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
          <SectionHeading>Transaction history</SectionHeading>
          {txToShow.map((tx) => (
            <StyledTransaction
              key={uuid()}
              time={new Date(tx.block.timestamp)}
              counterpartyAddress={tx.counterpartyAddress}
              amount={tx.decimalAmount}
              fiatEquivilent={formatFiat(tx.fiatValue, 'USD')}
              symbol={tx.symbol}
              confirmations={tx.confirmations}
              type={tx.type}
              viewOnBlockExplorerClick={
                EthNetworkProvider.name === 'ropsten' ?
                  () => shell.openExternal(`https://ropsten.etherscan.io/tx/${tx.hash}`) :
                  () => shell.openExternal(`https://etherscan.io/tx/${tx.hash}`)
              }
              onChange={() => this.updateExpandedTx(`${tx.hash}${tx.type}${tx.symbol}`)}
              defaultOpen={expandedTxs.has(`${tx.hash}${tx.type}${tx.symbol}`)}
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
  blockHeight: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentWalletWithInfo: makeSelectCurrentWalletWithInfo(),
  supportedAssets: makeSelectSupportedAssets(),
  blockHeight: makeSelectBlockHeight(),
});

export function mapDispatchToProps() {
  return {};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(WalletsTransactions);

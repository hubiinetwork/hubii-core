import React from 'react';
import { Alert } from 'antd';
import { shell } from 'electron';
import uuid from 'uuid/v4';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { getBreakdown } from 'utils/wallet';
import { formatFiat } from 'utils/numberFormats';

import Breakdown from 'components/Breakdown/Breakdown.component';
import SectionHeading from 'components/ui/SectionHeading';

import { makeSelectCurrentNetwork } from 'containers/App/selectors';

import {
  makeSelectCurrentWalletWithInfo,
} from 'containers/WalletHoc/selectors';

import {
  makeSelectBlockHeight,
} from 'containers/EthOperationsHoc/selectors';

import {
  makeSelectSupportedAssets,
} from 'containers/HubiiApiHoc/selectors';

import {
  StyledTransaction,
  TransactionsWrapper,
  BreakdownWrapper,
  OuterWrapper,
  StyledPagination,
  StyledSpin,
  LoadingWrapper,
  NoTxPlaceholder,
} from './style';

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
    const { currentWalletWithInfo, supportedAssets, currentNetwork, intl } = this.props;
    const { expandedTxs, currentPage } = this.state;
    const {formatMessage} = intl
    const start = (currentPage - 1) * 10;
    const end = start + 10;
    const txToShow = currentWalletWithInfo.getIn(['transactions', 'transactions'])
      .toJS()
      .slice(start, end);

    if
    (
      currentWalletWithInfo.getIn(['balances', 'loading']) ||
      supportedAssets.get('loading') ||
      currentWalletWithInfo.getIn(['transactions', 'loading'])
    ) {
      return (
        <LoadingWrapper>
          <StyledSpin size="large" tip={formatMessage({id: 'synchronising'})}></StyledSpin>
        </LoadingWrapper>
      );
    }
    if
    (
      currentWalletWithInfo.getIn(['transactions', 'error']) ||
      currentWalletWithInfo.getIn(['balances', 'error']) ||
      supportedAssets.get('error')
    ) {
      return <NoTxPlaceholder>{ formatMessage({id: 'fetch_transactions_error'}) }</NoTxPlaceholder>;
    }
    if (currentWalletWithInfo.getIn(['transactions', 'transactions']).size === 0) {
      return <NoTxPlaceholder>{ formatMessage({id: 'no_transaction_history'}) }</NoTxPlaceholder>;
    }
    return (
      <OuterWrapper>
        <TransactionsWrapper>
          <SectionHeading>{formatMessage({id: 'transaction_history'})}</SectionHeading>
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
                currentNetwork.provider.name === 'ropsten' ?
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
          <Alert
            message={formatMessage({id: 'where_my_transaction'})}
            description={
              <div>
                <span>
                  {formatMessage({id: 'my_transaction_notes_1'})}
                </span>
                <br />
                  {formatMessage({id: 'my_transaction_notes_2'})}
                <a
                  role="link"
                  tabIndex={0}
                  onClick={
                    currentNetwork.provider.name === 'ropsten' ?
                      () => shell.openExternal(`https://ropsten.etherscan.io/address/${currentWalletWithInfo.get('address')}`) :
                      () => shell.openExternal(`https://etherscan.io/address/${currentWalletWithInfo.get('address')}`)
                  }
                >{formatMessage({id: 'view_them_etherscan'})}</a>
                <span>.</span>
              </div>
              }
            type="info"
            showIcon
            style={{ margin: '2rem 0' }}
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
  currentNetwork: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentWalletWithInfo: makeSelectCurrentWalletWithInfo(),
  supportedAssets: makeSelectSupportedAssets(),
  blockHeight: makeSelectBlockHeight(),
  currentNetwork: makeSelectCurrentNetwork(),
});

export function mapDispatchToProps() {
  return {};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(injectIntl(WalletsTransactions));

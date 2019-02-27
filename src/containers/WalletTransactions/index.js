import React from 'react';
import { Alert } from 'antd';
import { shell } from 'electron';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { formatFiat } from 'utils/numberFormats';

import Breakdown from 'components/BreakdownPie';
import SectionHeading from 'components/ui/SectionHeading';
import Select, { Option } from 'components/ui/Select';
import ScrollableContentWrapper from 'components/ui/ScrollableContentWrapper';

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
    this.state = { currentPage: 1, expandedTxs: new Set(), filter: 'all' };
    this.onPaginationChange = this.onPaginationChange.bind(this);
    this.updateExpandedTx = this.updateExpandedTx.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
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
      this.props.blockHeight.get('height') !== nextProps.blockHeight.get('height') ||
      (this.state.filter !== nextState.filter)
    ) return true;
    return false;
  }


  onPaginationChange(newPage) {
    this.setState({ currentPage: newPage });
  }

  handleFilterChange(filter) {
    this.setState({ filter });
  }

  // persist which tx are expanded so we can keep UI consisent as the user flips
  // through pagination
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
    const { expandedTxs, currentPage, filter } = this.state;
    const { formatMessage } = intl;
    const start = (currentPage - 1) * 10;
    const end = start + 10;
    let filtered = currentWalletWithInfo.getIn(['transactions', 'transactions']);
    if (filter !== 'all') {
      filtered = currentWalletWithInfo
        .getIn(['transactions', 'transactions'])
        .filter((t) => t.get('layer') === filter);
    }
    const txToShow = filtered
      .toJS()
      .slice(start, end);

    if
    (
      currentWalletWithInfo.getIn(['balances', 'baseLayer', 'loading']) ||
      supportedAssets.get('loading') ||
      currentWalletWithInfo.getIn(['transactions', 'loading'])
    ) {
      return (
        <LoadingWrapper>
          <StyledSpin size="large" tip={formatMessage({ id: 'synchronising' })}></StyledSpin>
        </LoadingWrapper>
      );
    }
    if
    (
      currentWalletWithInfo.getIn(['transactions', 'error']) &&
      (currentWalletWithInfo.getIn(['transactions', 'transactions']).size === 0)
    ) {
      return <NoTxPlaceholder>{ formatMessage({ id: 'fetch_transactions_error' }) }</NoTxPlaceholder>;
    }
    if (currentWalletWithInfo.getIn(['transactions', 'transactions']).size === 0) {
      return <NoTxPlaceholder>{ formatMessage({ id: 'no_transaction_history' }) }</NoTxPlaceholder>;
    }
    return (
      <ScrollableContentWrapper>
        <OuterWrapper>
          <TransactionsWrapper>
            <div style={{ display: 'flex' }}>
              <SectionHeading>{formatMessage({ id: 'transaction_history' })}</SectionHeading>
              <Select
                style={{ width: '10rem', marginLeft: 'auto', marginBottom: '0.5rem' }}
                onChange={this.handleFilterChange}
                value={this.state.filter}
              >
                <Option key={'all'}>{formatMessage({ id: 'all' })}</Option>
                <Option key={'nahmii'}>{formatMessage({ id: 'only_nahmii' })}</Option>
                <Option key={'baseLayer'}>{formatMessage({ id: 'only_base_layer' })}</Option>
              </Select>
            </div>
            {txToShow.map((tx) => (
              <StyledTransaction
                key={`${tx.hash}${tx.type}${tx.symbol}${tx.id}`}
                time={new Date(tx.timestamp)}
                counterpartyAddress={tx.counterpartyAddress}
                amount={tx.decimalAmount}
                fiatEquivilent={formatFiat(tx.fiatValue, 'USD')}
                symbol={tx.symbol}
                confirmations={tx.confirmations}
                type={tx.type}
                layer={tx.layer}
                viewOnBlockExplorerClick={
                currentNetwork.provider._network.name === 'ropsten' ?
                  () => shell.openExternal(`https://ropsten.etherscan.io/tx/${tx.hash}`) :
                  () => shell.openExternal(`https://etherscan.io/tx/${tx.hash}`)
              }
                onChange={() => this.updateExpandedTx(`${tx.hash}${tx.type}${tx.symbol}${tx.id}`)}
                defaultOpen={expandedTxs.has(`${tx.hash}${tx.type}${tx.symbol}${tx.id}`)}
              />
            ))
          }
            {
            filtered.size > 0 &&
            <StyledPagination
              total={filtered.size}
              pageSize={10}
              defaultCurrent={currentPage}
              current={currentPage}
              onChange={this.onPaginationChange}
            />
          }
            <Alert
              message={formatMessage({ id: 'where_my_transaction' })}
              description={
                <div>
                  <span>
                    {formatMessage({ id: 'my_transaction_notes_1' })}
                  </span>
                  <br />
                  {formatMessage({ id: 'my_transaction_notes_2' })}
                  <a
                    role="link"
                    tabIndex={0}
                    onClick={
                    currentNetwork.provider._network.name === 'ropsten' ?
                      () => shell.openExternal(`https://ropsten.etherscan.io/address/${currentWalletWithInfo.get('address')}`) :
                      () => shell.openExternal(`https://etherscan.io/address/${currentWalletWithInfo.get('address')}`)
                  }
                  >{formatMessage({ id: 'view_them_etherscan' })}</a>
                  <span>.</span>
                </div>
              }
              type="info"
              showIcon
              style={{ margin: '2rem 0' }}
            />
          </TransactionsWrapper>
          {
            (!currentWalletWithInfo.getIn(['balances', 'baseLayer', 'error']) && !supportedAssets.get('error')) &&
            <BreakdownWrapper>
              <Breakdown
                totalBalances={currentWalletWithInfo.get('balances')}
                supportedAssets={supportedAssets}
              />
            </BreakdownWrapper>
          }
        </OuterWrapper>
      </ScrollableContentWrapper>
    );
  }
}

WalletsTransactions.propTypes = {
  currentWalletWithInfo: PropTypes.object.isRequired,
  supportedAssets: PropTypes.object.isRequired,
  blockHeight: PropTypes.object.isRequired,
  currentNetwork: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
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

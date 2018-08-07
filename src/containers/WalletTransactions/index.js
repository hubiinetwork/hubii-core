import React from 'react';
import { shell } from 'electron';
import uuid from 'uuid/v4';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { EthNetworkProvider } from 'utils/wallet';

import { Row, Col, Pagination } from 'antd';

import { makeSelectCurrentWalletWithInfo } from 'containers/WalletHOC/selectors';
import { SectionHeading } from 'components/ui/SectionHeading';
import { StyledTransaction } from './style';
import { formatFiat } from '../../utils/numberFormats';

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
    const { currentWalletWithInfo } = this.props;
    const { currentPage } = this.state;

    const start = (currentPage - 1) * 10;
    const end = start + 10;
    const txToShow = currentWalletWithInfo.getIn(['transactions', 'transactions'])
      .toJS()
      .slice(start, end);

    return (
      <Row gutter={16}>
        <Col>
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
          <Pagination
            total={currentWalletWithInfo.getIn(['transactions', 'transactions']).size}
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} transactions`}
            pageSize={10}
            defaultCurrent={currentPage}
            current={currentPage}
            onChange={this.onPaginationChange}
          />
        </Col>
      </Row>
    );
  }
}

WalletsTransactions.propTypes = {
  currentWalletWithInfo: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentWalletWithInfo: makeSelectCurrentWalletWithInfo(),
});

export function mapDispatchToProps() {
  return {};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(WalletsTransactions);

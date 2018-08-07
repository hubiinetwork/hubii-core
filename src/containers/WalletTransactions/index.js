/* eslint-disable */
import React from 'react';
import { shell } from 'electron';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Row, Col } from 'antd';
import {EthNetworkProvider} from 'utils/wallet';

import { makeSelectCurrentWalletWithInfo} from 'containers/WalletHOC/selectors';
import { SectionHeading } from 'components/ui/SectionHeading';
import Transaction from 'components/Transaction';

export class WalletsTransactions extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  // constructor(...args) {
  //   super(...args);
  // }


  render() {
    const {currentWalletDetails, transactions} = this.props

    return (
      <Row gutter={16}>
        <Col span={20} xs={20} md={16}>
          <SectionHeading>All Transactions</SectionHeading>
          <h2 style={{color: 'white'}}>Transaction history coming soon</h2>
          <p style={{color: 'white'}}>{`In the mean time, you can check your wallet's transaction history on Etherscan `}</p>
          <a onClick={()=> shell.openExternal(`https://ropsten.etherscan.io/address/${currentWalletDetails.get('address')}`)} >{`https://ropsten.etherscan.io/address/${currentWalletDetails.get('address')}`}</a>

          <Transaction
            time={ new Date('January 09, 1995 05:19:09') }
            counterpartyAddress={'0x000'}
            amount='0.000000000000000001'
            fiatEquivilent="$123.34 USD"
            symbol="UKG"
            confirmations="204"
            type="sent"
            viewOnBlockExplorerClick={
              EthNetworkProvider.name === 'ropsten' ?
                () => shell.openExternal(`https://ropsten.etherscan.io/tx/0x00`) :
                () => shell.openExternal(`https://etherscan.io/tx/0x00`)
            }
        />
        </Col>
        <Col span={4} xs={8} md={8}>
        </Col>
      </Row>
    );
  }
}

WalletsTransactions.propTypes = {
  // transactions: PropTypes.array.isRequired,
  // currentWalletDetails: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  // transactions: makeSelectAllTransactions(),
  currentWalletDetails: makeSelectCurrentWalletWithInfo(),
});

export function mapDispatchToProps(dispatch) {
  return {};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(WalletsTransactions);

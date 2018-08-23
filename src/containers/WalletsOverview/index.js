import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Row, Col } from 'antd';

import { getBreakdown } from 'utils/wallet';

import { deleteWallet, showDecryptWalletModal, setCurrentWallet } from 'containers/WalletHOC/actions';
import {
  makeSelectLedgerNanoSInfo,
  makeSelectTrezorInfo,
  makeSelectSupportedAssets,
  makeSelectTotalBalances,
  makeSelectWalletsWithInfo,
} from 'containers/WalletHOC/selectors';

import { SectionHeading } from 'components/ui/SectionHeading';
import WalletItemCard from 'components/WalletItemCard';
import Breakdown from 'components/Breakdown';

import { WalletCardsCol, Wrapper, WalletPlaceHolder } from './style';

export class WalletsOverview extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.renderWalletCards = this.renderWalletCards.bind(this);
    this.handleCardClick = this.handleCardClick.bind(this);
  }

  handleCardClick(card) {
    const { history } = this.props;
    history.push(`/wallet/${card.address}/overview`);
  }


  renderWalletCards() {
    const wallets = this.props.walletsWithInfo.toJS();
    if (wallets.length === 0) {
      return (
        <WalletPlaceHolder>
          {"Add a wallet to hubii core by clicking '+ Add a wallet' in the top right corner"}
        </WalletPlaceHolder>
      );
    }
    return wallets.map((wallet) => {
      let connected = false;
      if
      (
        (wallet.type === 'lns' && this.props.ledgerNanoSInfo.get('id') === wallet.deviceId) ||
        (wallet.type === 'trezor' && this.props.trezorInfo.get('id') === wallet.deviceId)
      ) connected = true;
      return (
        <WalletCardsCol
          span={12}
          key={wallet.name}
          xs={24}
          sm={24}
          lg={12}
        >
          <WalletItemCard
            name={wallet.name}
            totalBalance={(wallet.balances.loading || wallet.balances.error) ? 0 : wallet.balances.total.usd.toNumber()}
            balancesLoading={wallet.balances.loading}
            balancesError={!!wallet.balances.error}
            address={wallet.address}
            type={wallet.type}
            connected={connected}
            assets={wallet.balances.assets}
            mnemonic={wallet.decrypted ? wallet.decrypted.mnemonic : null}
            privateKey={wallet.decrypted ? wallet.decrypted.privateKey : null}
            isDecrypted={!!wallet.decrypted}
            showDecryptWalletModal={() => this.props.showDecryptWalletModal()}
            setCurrentWallet={() => this.props.setCurrentWallet(wallet.address)}
            handleCardClick={() => this.handleCardClick(wallet)}
            walletList={wallets}
            deleteWallet={() => this.props.deleteWallet(wallet.address)}
          />
        </WalletCardsCol>
      );
    }
    );
  }

  render() {
    const { totalBalances, supportedAssets } = this.props;
    return (
      <Wrapper>
        <Row gutter={32}>
          <Col sm={24} md={12} lg={16}>
            <SectionHeading>All wallets</SectionHeading>
            <Row type="flex" align="top" gutter={16}>
              {this.renderWalletCards()}
            </Row>
          </Col>
          <Col sm={24} md={12} lg={8}>
            {
              !totalBalances.get('loading') &&
              !totalBalances.get('error') &&
              !supportedAssets.get('loading') &&
              !supportedAssets.get('error') &&
              <Breakdown
                data={getBreakdown(totalBalances, supportedAssets)}
                value={(+this.props.totalBalances.getIn(['total', 'usd']).toFixed(6)).toString()}
              />
            }
          </Col>
        </Row>
      </Wrapper>
    );
  }
}

WalletsOverview.propTypes = {
  showDecryptWalletModal: PropTypes.func.isRequired,
  setCurrentWallet: PropTypes.func.isRequired,
  deleteWallet: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  ledgerNanoSInfo: PropTypes.object.isRequired,
  trezorInfo: PropTypes.object.isRequired,
  totalBalances: PropTypes.object.isRequired,
  supportedAssets: PropTypes.object.isRequired,
  walletsWithInfo: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  walletsWithInfo: makeSelectWalletsWithInfo(),
  totalBalances: makeSelectTotalBalances(),
  supportedAssets: makeSelectSupportedAssets(),
  ledgerNanoSInfo: makeSelectLedgerNanoSInfo(),
  trezorInfo: makeSelectTrezorInfo(),
});

export function mapDispatchToProps(dispatch) {
  return {
    deleteWallet: (...args) => dispatch(deleteWallet(...args)),
    showDecryptWalletModal: (...args) => dispatch(showDecryptWalletModal(...args)),
    setCurrentWallet: (...args) => dispatch(setCurrentWallet(...args)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(WalletsOverview);

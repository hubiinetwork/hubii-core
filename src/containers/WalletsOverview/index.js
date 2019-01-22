import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Row, Col } from 'antd';
import { injectIntl } from 'react-intl';
import {
  SortableContainer,
  SortableElement,
} from 'react-sortable-hoc';

import { isConnected } from 'utils/wallet';

import {
  deleteWallet,
  showDecryptWalletModal,
  setCurrentWallet,
  lockWallet,
  dragWallet,
} from 'containers/WalletHoc/actions';

import {
  makeSelectWalletsWithInfo,
  makeSelectTotalBalances,
} from 'containers/WalletHoc/selectors';

import {
  makeSelectSupportedAssets,
  makeSelectPrices,
} from 'containers/HubiiApiHoc/selectors';

import {
  makeSelectLedgerHoc,
} from 'containers/LedgerHoc/selectors';

import {
  makeSelectTrezorHoc,
} from 'containers/TrezorHoc/selectors';

import SectionHeading from 'components/ui/SectionHeading';
import WalletItemCard from 'components/WalletItemCard';
import BreakdownPie from 'components/BreakdownPie';
import ScrollableContentWrapper from 'components/ui/ScrollableContentWrapper';

import PlaceholderText from 'components/ui/PlaceholderText';
import { WalletCardsCol } from './style';

export class WalletsOverview extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = { dragged: null };
    this.renderWalletCards = this.renderWalletCards.bind(this);
    this.handleCardClick = this.handleCardClick.bind(this);
    this.unlockWallet = this.unlockWallet.bind(this);
    this.onSortEnd = this.onSortEnd.bind(this);
    this.updateBeforeSortStart = this.updateBeforeSortStart.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.dragged !== null) return false;
    return true;
  }

  onSortEnd({ oldIndex, newIndex }) {
    this.props.dragWallet({ oldIndex, newIndex });
    this.setState({ dragged: null });
  }

  updateBeforeSortStart({ index }) {
    this.setState({ dragged: index });
  }

  handleCardClick(card) {
    const { history } = this.props;
    history.push(`/wallet/${card.address}/overview`);
  }

  unlockWallet(address) {
    this.props.setCurrentWallet(address);
    this.props.showDecryptWalletModal();
  }


  renderWalletCards() {
    const { priceInfo, ledgerNanoSInfo, trezorInfo } = this.props;
    const { formatMessage } = this.props.intl;

    const wallets = this.props.walletsWithInfo.toJS();
    if (wallets.length === 0) {
      return (
        <PlaceholderText>
          {formatMessage({ id: 'add_wallet_tip' })}
        </PlaceholderText>
      );
    }

    const SortableWallet = SortableElement(({ wallet }) => {
      const connected = isConnected(wallet, ledgerNanoSInfo.toJS(), trezorInfo.toJS());
      const baseLayerBalance = wallet.balances.baseLayer;
      const nahmiiBalance = wallet.balances.nahmiiCombined;
      return (
        <WalletCardsCol
          span={10}
          key={wallet.name}
          xs={23}
          sm={23}
          lg={11}
        >
          <WalletItemCard
            name={wallet.name}
            totalBalance={(baseLayerBalance.loading || baseLayerBalance.error) ? 0 : baseLayerBalance.total.usd.toNumber()}
            baseLayerBalancesLoading={baseLayerBalance.loading}
            baseLayerBalancesError={!!baseLayerBalance.error}
            nahmiiBalancesLoading={nahmiiBalance.loading}
            nahmiiBalancesError={!!nahmiiBalance.error}
            address={wallet.address}
            type={wallet.type}
            connected={connected}
            baseLayerAssets={baseLayerBalance.assets}
            nahmiiAssets={nahmiiBalance.assets}
            mnemonic={wallet.decrypted ? wallet.decrypted.mnemonic : null}
            privateKey={wallet.decrypted ? wallet.decrypted.privateKey : null}
            isDecrypted={!!wallet.decrypted}
            showDecryptWalletModal={() => this.props.showDecryptWalletModal()}
            setCurrentWallet={() => this.props.setCurrentWallet(wallet.address)}
            handleCardClick={() => this.handleCardClick(wallet)}
            walletList={wallets}
            deleteWallet={() => this.props.deleteWallet(wallet.address)}
            lock={() => this.props.lockWallet(wallet.address)}
            unlock={() => this.unlockWallet(wallet.address)}
            priceInfo={priceInfo.toJS().assets}
          />
        </WalletCardsCol>
      );
    });

    const SortableList = SortableContainer((props) => (
      <Row type="flex" align="top" gutter={16}>
        {props.wallets.map((wallet, index) => (
          <SortableWallet key={wallet.name} index={index} wallet={wallet} />
        ))}
      </Row>
    ));

    return (
      <SortableList
        wallets={wallets}
        onSortEnd={this.onSortEnd}
        updateBeforeSortStart={(...args) => this.updateBeforeSortStart(...args)}
        axis="xy"
        lockToContainerEdges
        lockOffset="20%"
        distance={5}
      />
    );
  }

  render() {
    const { totalBalances, supportedAssets } = this.props;
    const { formatMessage } = this.props.intl;
    const walletCards = this.renderWalletCards();
    return (
      <ScrollableContentWrapper>
        <Row gutter={32} style={{ marginTop: '1rem' }}>
          <Col sm={24} md={12} lg={16}>
            <SectionHeading>
              {formatMessage({ id: 'all_wallets' })}
            </SectionHeading>
            {walletCards}
          </Col>
          <Col sm={24} md={12} lg={8}>
            {
              !supportedAssets.get('loading') &&
              !supportedAssets.get('error') &&
              <div>
                <SectionHeading>{formatMessage({ id: 'balance_breakdown' })}</SectionHeading>
                <BreakdownPie
                  totalBalances={totalBalances}
                  supportedAssets={supportedAssets}
                />
              </div>
            }
          </Col>
        </Row>
      </ScrollableContentWrapper>
    );
  }
}

WalletsOverview.propTypes = {
  showDecryptWalletModal: PropTypes.func.isRequired,
  setCurrentWallet: PropTypes.func.isRequired,
  deleteWallet: PropTypes.func.isRequired,
  lockWallet: PropTypes.func.isRequired,
  dragWallet: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  ledgerNanoSInfo: PropTypes.object.isRequired,
  trezorInfo: PropTypes.object.isRequired,
  totalBalances: PropTypes.object.isRequired,
  supportedAssets: PropTypes.object.isRequired,
  walletsWithInfo: PropTypes.object.isRequired,
  priceInfo: PropTypes.object,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  walletsWithInfo: makeSelectWalletsWithInfo(),
  totalBalances: makeSelectTotalBalances(),
  supportedAssets: makeSelectSupportedAssets(),
  ledgerNanoSInfo: makeSelectLedgerHoc(),
  trezorInfo: makeSelectTrezorHoc(),
  priceInfo: makeSelectPrices(),
});

export function mapDispatchToProps(dispatch) {
  return {
    deleteWallet: (...args) => dispatch(deleteWallet(...args)),
    lockWallet: (addr) => dispatch(lockWallet(addr)),
    dragWallet: (...args) => dispatch(dragWallet(...args)),
    showDecryptWalletModal: (...args) => dispatch(showDecryptWalletModal(...args)),
    setCurrentWallet: (...args) => dispatch(setCurrentWallet(...args)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(injectIntl(WalletsOverview));

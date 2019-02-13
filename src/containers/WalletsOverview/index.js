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
  deleteWallet as deleteWalletAction,
  showDecryptWalletModal,
  setCurrentWallet,
  lockWallet as lockWalletAction,
  dragWallet as dragWalletAction,
} from 'containers/WalletHoc/actions';

import { notify as notifyAction } from 'containers/App/actions';

import {
  makeSelectWalletsWithInfo,
  makeSelectTotalBalances,
} from 'containers/NahmiiHoc/combined-selectors';

import {
  makeSelectWallets,
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

const SortableWallet = SortableElement((props) => {
  const connected = isConnected(props.wallet, props.ledgerNanoSInfo.toJS(), props.trezorInfo.toJS());
  const baseLayerBalance = props.wallet.balances.baseLayer;
  const nahmiiBalance = props.wallet.balances.nahmiiCombined;
  return (
    <WalletCardsCol
      span={10}
      key={props.wallet.name}
      xs={23}
      sm={23}
      lg={11}
    >
      <WalletItemCard
        name={props.wallet.name}
        totalBalance={(baseLayerBalance.loading || baseLayerBalance.error) ? 0 : baseLayerBalance.total.usd.toNumber()}
        baseLayerBalancesLoading={baseLayerBalance.loading}
        baseLayerBalancesError={!!baseLayerBalance.error}
        nahmiiBalancesLoading={nahmiiBalance.loading}
        nahmiiBalancesError={!!nahmiiBalance.error}
        address={props.wallet.address}
        type={props.wallet.type}
        connected={connected}
        baseLayerAssets={baseLayerBalance.assets}
        nahmiiAssets={nahmiiBalance.assets}
        mnemonic={props.wallet.decrypted ? props.wallet.decrypted.mnemonic : null}
        privateKey={props.wallet.decrypted ? props.wallet.decrypted.privateKey : null}
        isDecrypted={!!props.wallet.decrypted}
        showDecryptWalletModal={() => props.showDecryptWalletModal()}
        setCurrentWallet={() => props.setCurrentWallet(props.wallet.address)}
        handleCardClick={() => props.handleCardClick(props.wallet)}
        deleteWallet={() => props.deleteWallet(props.wallet.address)}
        lock={() => props.lockWallet(props.wallet.address)}
        unlock={() => props.unlockWallet(props.wallet.address)}
        priceInfo={props.priceInfo.toJS().assets}
        notify={props.notify}
      />
    </WalletCardsCol>
  );
});

const SortableList = SortableContainer((props) => (
  <Row type="flex" align="top" gutter={16}>
    {props.walletsWithInfo.map((wallet, index) => (
      <SortableWallet
        showDecryptWalletModal={props.showDecryptWalletModal}
        deleteWallet={props.deleteWallet}
        lockWallet={props.lockWallet}
        unlockWallet={props.unlockWallet}
        handleCardClick={props.handleCardClick}
        notify={props.notify}
        ledgerNanoSInfo={props.ledgerNanoSInfo}
        trezorInfo={props.trezorInfo}
        priceInfo={props.priceInfo}
        key={wallet.name}
        index={index}
        wallet={wallet}
        setCurrentWallet={props.setCurrentWallet}
      />
    ))}
  </Row>
));

export class WalletsOverview extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.renderWalletCards = this.renderWalletCards.bind(this);
    this.handleCardClick = this.handleCardClick.bind(this);
    this.unlockWallet = this.unlockWallet.bind(this);
    this.onSortEnd = this.onSortEnd.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const updated = !(JSON.stringify(nextProps.walletsWithInfo.toJS()) === JSON.stringify(this.props.walletsWithInfo.toJS()));
    console.log('wallets with info', updated);
    return updated;
  }

  onSortEnd({ oldIndex, newIndex }) {
    const { dragWallet, wallets } = this.props;
    dragWallet({ wallets, oldIndex, newIndex });
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
    const {
      priceInfo,
      ledgerNanoSInfo,
      trezorInfo,
      deleteWallet,
      lockWallet,
      notify,
    } = this.props;
    const { formatMessage } = this.props.intl;

    const walletsWithInfo = this.props.walletsWithInfo.toJS();
    if (walletsWithInfo.length === 0) {
      return (
        <PlaceholderText>
          {formatMessage({ id: 'add_wallet_tip' })}
        </PlaceholderText>
      );
    }
    return (
      <SortableList
        walletsWithInfo={walletsWithInfo}
        onSortEnd={this.onSortEnd}
        axis="xy"
        lockToContainerEdges
        lockOffset="20%"
        distance={5}
        showDecryptWalletModal={this.props.showDecryptWalletModal}
        priceInfo={priceInfo}
        ledgerNanoSInfo={ledgerNanoSInfo}
        trezorInfo={trezorInfo}
        deleteWallet={deleteWallet}
        lockWallet={lockWallet}
        unlockWallet={this.unlockWallet}
        handleCardClick={this.handleCardClick}
        notify={notify}
        setCurrentWallet={this.props.setCurrentWallet}
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
  notify: PropTypes.func.isRequired,
  lockWallet: PropTypes.func.isRequired,
  dragWallet: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  ledgerNanoSInfo: PropTypes.object.isRequired,
  trezorInfo: PropTypes.object.isRequired,
  totalBalances: PropTypes.object.isRequired,
  supportedAssets: PropTypes.object.isRequired,
  walletsWithInfo: PropTypes.object.isRequired,
  wallets: PropTypes.object.isRequired,
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
  wallets: makeSelectWallets(),
});

export function mapDispatchToProps(dispatch) {
  return {
    deleteWallet: (...args) => dispatch(deleteWalletAction(...args)),
    lockWallet: (addr) => dispatch(lockWalletAction(addr)),
    dragWallet: (...args) => dispatch(dragWalletAction(...args)),
    showDecryptWalletModal: (...args) => dispatch(showDecryptWalletModal(...args)),
    setCurrentWallet: (...args) => dispatch(setCurrentWallet(...args)),
    notify: (...args) => dispatch(notifyAction(...args)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(injectIntl(WalletsOverview));

import { Icon, Dropdown, Popover } from 'antd';
import * as React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import CopyToClipboard from 'react-copy-to-clipboard';

import { trimDecimals, isHardwareWallet, isAddressMatch } from 'utils/wallet';
import { formatFiat } from 'utils/numberFormats';
import WalletStatusIndicator from 'components/WalletStatusIndicator';
import DeletionModal from 'components/DeletionModal';
import { Modal } from 'components/ui/Modal';
import NahmiiText from 'components/ui/NahmiiText';
import Text from 'components/ui/Text';
import ExportPrivateInfo from 'components/ExportPrivateInfo';

import WalletDetailPopoverContent from './WalletDetailPopoverContent';
import AssetAmountBubble from './AssetAmountBubble';

import {
  AssetsWrapper,
  AssetWrapper,
  CardIcon,
  LeftSideWrapper,
  TotalBalance,
  DynamicOuterWrapper,
  IconMenu as Menu,
  MenuItem,
  MenuDivider,
  CardIconSettings,
  Border,
  WalletName,
  Spinner,
  QuickAddressWrapper,
  QuickAddressText,
  QuickAddressIcon,
  ToggleExpandedArrow,
  BalanceDetails,
} from './style';

/**
 * This component shows details of a wallet in the card.
 */
export class WalletItemCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisibility: false,
      modalType: '',
    };
    this.settingsMenu = this.settingsMenu.bind(this);
    this.handleDeleteWallet = this.handleDeleteWallet.bind(this);
    this.handleExportSeedWords = this.handleExportSeedWords.bind(this);
    this.handleClickCopy = this.handleClickCopy.bind(this);
  }

  settingsMenu(walletType, isDecrypted) {
    const menuItems = [];
    const { formatMessage } = this.props.intl;
    if (walletType === 'software') {
      if (isDecrypted) {
        menuItems.push(
          <MenuItem key="1" onClick={this.props.lock}>
            {formatMessage({ id: 'lock' })}
          </MenuItem>
        );
      } else {
        menuItems.push(
          <MenuItem key="2" onClick={this.props.unlock}>
            {formatMessage({ id: 'unlock' })}
          </MenuItem>
        );
      }
      menuItems.push(<MenuDivider key="3" />);
      menuItems.push(
        <MenuItem key="4" onClick={this.handleExportSeedWords}>
          {formatMessage({ id: 'backup_wallet' })}
        </MenuItem>
      );
      menuItems.push(<MenuDivider key="5" />);
    }
    menuItems.push(
      <MenuItem
        key="6"
        onClick={() =>
          this.setState({ modalVisibility: true, modalType: 'deleteWallet' })
        }
      >
        {formatMessage({ id: 'delete_wallet' })}
      </MenuItem>
    );
    return <Menu visible singleitem={(menuItems.length === 1).toString()}>{menuItems.map((item) => item)}</Menu>;
  }

  async handleExportSeedWords() {
    this.setState({ modalVisibility: true, modalType: 'exportSeedWords' });
    if (!this.props.isDecrypted) {
      await this.props.setCurrentWallet();
      this.props.showDecryptWalletModal();
    }
  }

  handleDeleteWallet() {
    this.props.deleteWallet();
    this.setState({ modalVisibility: false });
  }

  handleClickCopy(e) {
    e.stopPropagation();
    const { intl, notify } = this.props;
    notify('success', intl.formatMessage({ id: 'address_clipboard' }));
  }

  render() {
    const {
      address,
      name,
      folded,
      baseLayerBalancesLoading,
      baseLayerBalancesError,
      nahmiiBalancesLoading,
      nahmiiBalancesError,
      connected,
      type,
      handleCardClick,
      handleToggleFold,
      totalBalance,
      isDecrypted,
      baseLayerAssets,
      nahmiiAssets,
      mnemonic,
      privateKey,
    } = this.props;

    const { formatMessage } = this.props.intl;

    const { modalVisibility, modalType } = this.state;

    let baseLayerAssetBubbles = null;
    let nahmiiAssetBubbles = null;
    if (baseLayerAssets) {
      baseLayerAssetBubbles = baseLayerAssets.map((asset) => (
        <AssetWrapper key={asset.currency}>
          <AssetAmountBubble
            name={asset.symbol}
            amount={trimDecimals(asset.balance, asset.currency, this.props.priceInfo.find((c) => isAddressMatch(c.currency, asset.currency)))}
          />
        </AssetWrapper>
      ));
    }
    if (nahmiiAssets) {
      nahmiiAssetBubbles = nahmiiAssets.length === 0
        ? (
          <AssetWrapper>
            <AssetAmountBubble
              name={'ETH'}
              amount={'0'}
            />
          </AssetWrapper>
        )
        : nahmiiAssets.map((asset) => (
          <AssetWrapper key={asset.currency}>
            <AssetAmountBubble
              name={asset.symbol}
              amount={trimDecimals(asset.balance, asset.currency, this.props.priceInfo.find((c) => isAddressMatch(c.currency, asset.currency)))}
            />
          </AssetWrapper>
      ));
    }

    let modal;
    switch (modalType) {
      case 'deleteWallet':
        modal = (
          <DeletionModal
            type="wallet"
            onCancel={() => this.setState({ modalVisibility: false })}
            onDelete={this.handleDeleteWallet}
            name={name}
            address={address}
          />
        );
        break;
      default:
        modal = (
          <ExportPrivateInfo
            onExit={() => this.setState({ modalVisibility: false })}
            onDelete={this.handleDeleteWallet}
            name={name}
            address={address}
            mnemonic={mnemonic}
            privateKey={privateKey}
          />
        );
    }
    return (
      <Border>
        <WalletStatusIndicator
          active={connected || isDecrypted}
          walletType={isHardwareWallet(type) ? 'hardware' : 'software'}
        />
        <DynamicOuterWrapper
          folded={folded}
          onClick={() => {
            handleCardClick(address);
          }}
        >
          <LeftSideWrapper
            onClick={(e) => {
              handleToggleFold(e, address);
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline' }}>
              <WalletName large>{name}</WalletName>
              <QuickAddressWrapper>
                <QuickAddressText>
                  {`${address.slice(0, 6)}..${address.slice(38, 42)}`}
                </QuickAddressText>
                &nbsp;
                <CopyToClipboard text={address}>
                  <QuickAddressIcon onClick={this.handleClickCopy} />
                </CopyToClipboard>
              </QuickAddressWrapper>
            </div>
            {!baseLayerBalancesLoading && !baseLayerBalancesError &&
              <TotalBalance>{`${formatFiat(totalBalance, 'USD')}`}</TotalBalance>
            }
            <div style={{ display: 'flex', position: 'absolute', right: 0 }}>
              <CardIcon>
                <Popover
                  placement="right"
                  trigger="hover"
                  content={
                    <WalletDetailPopoverContent address={address} type={type} />
                  }
                >
                  <Icon type="info-circle-o" style={{ fontSize: '1.4rem' }} />
                </Popover>
              </CardIcon>
              <ToggleExpandedArrow
                expanded={folded ? 0 : 1}
                onClick={(e) => {
                  handleToggleFold(e, address);
                }}
              />
            </div>
          </LeftSideWrapper>
          {
            <BalanceDetails>
              <div>
                <Text>{formatMessage({ id: 'base_layer_balances' })}</Text>
                <AssetsWrapper>
                  {
                    baseLayerBalancesError
                    && <WalletName>{formatMessage({ id: 'fetch_balance_error' })}</WalletName>
                  }
                  {
                    baseLayerBalancesLoading &&
                    <Spinner type="loading" />
                  }
                  {!baseLayerBalancesLoading && !baseLayerBalancesError && baseLayerAssetBubbles}
                </AssetsWrapper>
              </div>
              <div style={{ marginTop: '1.25rem' }}>
                <NahmiiText />
                <Text>
                  &nbsp;{formatMessage({ id: 'balances' })}
                </Text>
                <AssetsWrapper>
                  {
                    nahmiiBalancesError
                    && <WalletName>{formatMessage({ id: 'fetch_balance_error' })}</WalletName>
                  }
                  {
                    nahmiiBalancesLoading
                    && <Spinner type="loading" />
                  }
                  {!nahmiiBalancesLoading && !nahmiiBalancesError && nahmiiAssetBubbles}
                </AssetsWrapper>
              </div>
            </BalanceDetails>
          }
          <CardIconSettings>
            <Dropdown placement="bottomLeft" overlay={this.settingsMenu(type, isDecrypted)}>
              <Icon
                type="setting"
                style={{ marginTop: -35, position: 'absolute', fontSize: '1.4rem' }}
              />
            </Dropdown>
          </CardIconSettings>
        </DynamicOuterWrapper>
        <Modal
          footer={null}
          width={modalType === 'deleteWallet' ? '37.14rem' : '50rem'}
          maskClosable
          style={{ marginTop: '1.43rem' }}
          visible={
            (isDecrypted && modalVisibility) ||
            (modalVisibility && modalType === 'deleteWallet')
          }
          onCancel={() => this.setState({ modalVisibility: false })}
          destroyOnClose
        >
          {modal}
        </Modal>
      </Border>
    );
  }
}

WalletItemCard.propTypes = {
  name: PropTypes.string.isRequired,
  folded: PropTypes.bool.isRequired,
  totalBalance: PropTypes.number.isRequired,
  baseLayerAssets: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      amount: PropTypes.number,
    })
  ),
  nahmiiAssets: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      amount: PropTypes.number,
    })
  ),
  address: PropTypes.string.isRequired,
  baseLayerBalancesLoading: PropTypes.bool.isRequired,
  baseLayerBalancesError: PropTypes.bool.isRequired,
  nahmiiBalancesLoading: PropTypes.bool.isRequired,
  nahmiiBalancesError: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
  connected: PropTypes.bool,
  handleCardClick: PropTypes.func.isRequired,
  handleToggleFold: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
  deleteWallet: PropTypes.func.isRequired,
  lock: PropTypes.func.isRequired,
  unlock: PropTypes.func.isRequired,
  showDecryptWalletModal: PropTypes.func.isRequired,
  isDecrypted: PropTypes.bool.isRequired,
  mnemonic: PropTypes.string,
  privateKey: PropTypes.string,
  priceInfo: PropTypes.arrayOf(PropTypes.object),
  intl: PropTypes.object,
};

export default injectIntl(WalletItemCard);

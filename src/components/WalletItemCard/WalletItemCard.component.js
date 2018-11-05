import { Icon, Dropdown, Popover } from 'antd';
import * as React from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import { injectIntl } from 'react-intl';

import { isHardwareWallet, isAddressMatch } from 'utils/wallet';
import WalletStatusIndicator from 'components/WalletStatusIndicator';
import DeletionModal from 'components/DeletionModal';
import ExportPrivateInfo from 'components/ExportPrivateInfo';
import WalletDetailPopoverContent from './WalletDetailPopoverContent';
import AssetAmountBubble from './AssetAmountBubble';
import { Modal } from '../ui/Modal';
import { formatFiat } from '../../utils/numberFormats';

import {
  AssetsWrapper,
  AssetWrapper,
  CardIcon,
  LeftSideWrapper,
  TotalBalance,
  OuterWrapper,
  IconMenu as Menu,
  MenuItem,
  MenuDivider,
  CardIconSettings,
  OverflowHidden,
  IconsWrapper,
  WalletName,
  Spinner,
} from './WalletItemCard.style';

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
    this.determineAmount = this.determineAmount.bind(this);
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

  /*
   * This function will reduce the amount's decimal places according to 0.01 usd of the currency.
   *
   */
  determineAmount(amount, currency) {
    const extractedCurrency = this.props.priceInfo.find((currencyItem) => isAddressMatch(currencyItem.currency, currency));

    // check to see if this currency is a test token, in which case just use a default number, 6, of decimal places
    if (extractedCurrency.usd === '0') {
      return amount.toFixed(5);
    }

    // find what 0.01 usd is in the relevant currency
    const ratio = new BigNumber(0.01).dividedBy(extractedCurrency.usd).toString();
    const ratioSplitByDot = ratio.split('.');
    const amountSplitByDot = amount.toString().split('.');

    // check to see if the amount was a whole value, in which case just return as there is no need for decimal alteration
    if (amountSplitByDot.length === 1) {
      return amount.toString();
    }

    // otherwise, find how many 0's there are after the decimal place on the ratio + 1, and minus that with the length of the
    // number of digits after the decimal place on the ratio.
    const decimalPlacement = (ratioSplitByDot[1].toString().length - parseFloat(ratioSplitByDot[1]).toString().length) + 1;
    return `${amountSplitByDot[0]}.${amountSplitByDot[1].substr(0, decimalPlacement)}`;
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

  render() {
    const {
      address,
      name,
      balancesLoading,
      balancesError,
      connected,
      type,
      handleCardClick,
      totalBalance,
      isDecrypted,
      assets,
      mnemonic,
      privateKey,
    } = this.props;

    const { formatMessage } = this.props.intl;

    const { modalVisibility, modalType } = this.state;

    let assetBubbles = null;
    if (assets) {
      assetBubbles = assets.map((asset) => (
        <AssetWrapper key={asset.currency}>
          <AssetAmountBubble name={asset.symbol} amount={this.determineAmount(asset.balance, asset.currency)} />
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
      <OverflowHidden>
        <WalletStatusIndicator
          active={connected || isDecrypted}
          walletType={isHardwareWallet(type) ? 'hardware' : 'software'}
        />
        <IconsWrapper>
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
          <CardIconSettings>
            <Dropdown placement="bottomLeft" overlay={this.settingsMenu(type, isDecrypted)}>
              <Icon
                type="setting"
                style={{ marginTop: 65, position: 'absolute', fontSize: '1.4rem' }}
              />
            </Dropdown>
          </CardIconSettings>
        </IconsWrapper>
        <OuterWrapper
          onClick={() => {
            handleCardClick(address);
          }}
        >
          <LeftSideWrapper>
            <WalletName>{name}</WalletName>
            {!balancesLoading && !balancesError &&
              <TotalBalance>{`${formatFiat(totalBalance, 'USD')}`}</TotalBalance>
            }
          </LeftSideWrapper>
          <AssetsWrapper>
            {
              balancesError && <WalletName>{formatMessage({ id: 'fetch_balance_error' })}</WalletName>
            }
            {
              balancesLoading &&
                <Spinner type="loading" />
            }
            {!balancesLoading && !balancesError && assetBubbles}
          </AssetsWrapper>
        </OuterWrapper>
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
      </OverflowHidden>
    );
  }
}

WalletItemCard.propTypes = {
  /**
   * name of the wallet.
   */
  name: PropTypes.string.isRequired,
  /**
   * total Balance of the wallet.
   */
  totalBalance: PropTypes.number.isRequired,
  /**
   * assets/coins in a wallet.
   */
  assets: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      amount: PropTypes.number,
    })
  ),
  address: PropTypes.string.isRequired,
  balancesLoading: PropTypes.bool.isRequired,
  balancesError: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
  connected: PropTypes.bool,
  handleCardClick: PropTypes.func.isRequired,
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

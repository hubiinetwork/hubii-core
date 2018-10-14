import { Icon, Dropdown, Popover } from 'antd';
import * as React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { isHardwareWallet, isAddressMatch } from 'utils/wallet';
import DeletionModal from 'components/DeletionModal';
import ExportPrivateInfo from 'components/ExportPrivateInfo';
import WalletDetailPopoverContent from './WalletDetailPopoverContent';
import AssetAmountBubble from './AssetAmountBubble';
import USBFlag from '../USBFlag';
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


  settingsMenu(walletType) {
    const menuItems = [];
    const { formatMessage } = this.props.intl;
    menuItems.push(
      <MenuItem
        key="1"
        onClick={() =>
          this.setState({ modalVisibility: true, modalType: 'deleteWallet' })
        }
      >
        {formatMessage({ id: 'delete_wallet' })}
      </MenuItem>
    );
    if (walletType === 'software') {
      menuItems.push(<MenuDivider key="2" />);
      menuItems.push(
        <MenuItem key="3" onClick={this.handleExportSeedWords}>
          {formatMessage({ id: 'backup_wallet' })}
        </MenuItem>
      );
    }
    return <Menu visible singleitem={(menuItems.length === 1).toString()}>{menuItems.map((item) => item)}</Menu>;
  }

  /*
   * This function will reduce the amount's decimal places according to 0.01 usd of the currency.
   *
   */
  determineAmount(amount, currency) {
    const extractedCurrency = this.props.priceInfo.find((currencyItem) => isAddressMatch(currencyItem.currency, currency));

    // find what 0.01 usd is in the relevant currency
    const ratio = 0.01 / extractedCurrency.usd;
    const ratioSplitByDot = ratio.toString().split('.');
    const amountSplitByDot = amount.toString().split('.');

    // check to see if the amount was a whole value, in which case just return as there is no need for decimal alteration
    if (amountSplitByDot.length === 1) {
      return amount.toString();
    }

    // check to see if this currency is a test token, in which case just use a default number, 6, of decimal places
    if (!extractedCurrency.usd) {
      return `${amountSplitByDot[0]}.${amountSplitByDot[1].substr(0, 6)}`;
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
        {isHardwareWallet(type) && <USBFlag connected={connected} />}
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
            <Dropdown placement="bottomLeft" overlay={this.settingsMenu(type)}>
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
  /**
   * primary Address of the wallet.
   */
  address: PropTypes.string.isRequired,
  /**
   * if balances are loading
   */
  balancesLoading: PropTypes.bool.isRequired,
  /**
   * if unable to display balances due to API error
   */
  balancesError: PropTypes.bool.isRequired,
  /**
   * props.type type of the wallet.
   */
  type: PropTypes.string.isRequired,
  /**
   * props.bool shows connection status  of  wallet if  provided.
   */
  connected: PropTypes.bool,
  /**
   * Function which handles the on card click event
   */
  handleCardClick: PropTypes.func.isRequired,
  /**
   * Function whichDeletes a wallet
   */
  deleteWallet: PropTypes.func.isRequired,
  /**
   * Function which decrypts wallet
   */
  showDecryptWalletModal: PropTypes.func.isRequired,
  // setCurrentWallet: PropTypes.func.isRequired,
  /**
   * Indicates, as a boolean, whether wallet is decrypted or not
   */
  isDecrypted: PropTypes.bool.isRequired,
  /**
   * Wallet's mnemonic
   */
  mnemonic: PropTypes.string,
  /**
   * Wallet's private key
   */
  privateKey: PropTypes.string,
  /**
   * Price list
   */
  priceInfo: PropTypes.arrayOf(PropTypes.object),
  intl: PropTypes.object,
};

export default injectIntl(WalletItemCard);

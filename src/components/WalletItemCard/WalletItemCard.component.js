import { Icon, Dropdown, Popover } from 'antd';
import * as React from 'react';
import PropTypes from 'prop-types';
import DeletionModal from 'components/DeletionModal';
import ExportPrivateInfo from 'components/ExportPrivateInfo';
import WalletDetailPopoverContent from './WalletDetailPopoverContent';
import AssetAmountBubble from './AssetAmountBubble';
import USBFlag from '../USBFlag';

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
  SpaceBetween,
} from './WalletItemCard.style';
import { Modal } from '../ui/Modal';
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
  }

  settingsMenu() {
    return (
      <Menu>
        <MenuItem onClick={this.handleExportSeedWords}>Export Private Infomation</MenuItem>
        <MenuDivider />
        <MenuItem onClick={() => this.setState({ modalVisibility: true, modalType: 'deleteWallet' })}>Delete Wallet</MenuItem>
      </Menu>
    );
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
      primaryAddress,
      name,
      connected,
      type,
      handleCardClick,
      totalBalance,
      isDecrypted,
      assets,
      mnemonic,
      privateKey,
    } = this.props;

    const { modalVisibility, modalType } = this.state;

    let modal;
    switch (modalType) {
      case 'deleteWallet':
        modal =
          (<DeletionModal
            type="wallet"
            onCancel={() => this.setState({ modalVisibility: false })}
            onDelete={this.handleDeleteWallet}
            name={name}
            address={primaryAddress}
          />);
        break;
      default:
        modal =
          (<ExportPrivateInfo
            onExit={() => this.setState({ modalVisibility: false })}
            onDelete={this.handleDeleteWallet}
            name={name}
            address={primaryAddress}
            mnemonic={mnemonic}
            privateKey={privateKey}
          />);
    }

    return (
      <OverflowHidden>
        {connected !== undefined && <USBFlag connected={connected} />}
        <SpaceBetween>
          <CardIcon>
            <Popover
              placement="right"
              trigger="hover"
              content={
                <WalletDetailPopoverContent
                  address={primaryAddress}
                  type={type}
                />
              }
            >
              <Icon type="info-circle-o" />
            </Popover>
          </CardIcon>
          <CardIconSettings>
            <Dropdown
              placement="bottomLeft"
              overlay={this.settingsMenu()}
            >
              <Icon type="setting" />
            </Dropdown>
          </CardIconSettings>
        </SpaceBetween>
        <OuterWrapper onClick={() => { handleCardClick(primaryAddress); }}>
          <LeftSideWrapper>
            <p>{name}</p>
            <AssetsWrapper>
              {assets &&
              assets.map((asset) => (
                <AssetWrapper key={asset.name}>
                  <AssetAmountBubble name={asset.name} amount={asset.amount} />
                </AssetWrapper>
              ))}
            </AssetsWrapper>
          </LeftSideWrapper>
          <TotalBalance>{`$${totalBalance.toLocaleString('en')}`}</TotalBalance>
        </OuterWrapper>
        <Modal
          footer={null}
          width={modalType === 'deleteWallet' ? '520px' : '700px'}
          maskClosable
          maskStyle={{ background: 'rgba(232,237,239,.65)' }}
          style={{ marginTop: '20px' }}
          visible={(isDecrypted && modalVisibility) || (modalVisibility && modalType === 'deleteWallet')}
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
  primaryAddress: PropTypes.string.isRequired,
  /**
   * props.type type of the wallet.
   */
  type: PropTypes.string.isRequired,
  /**
   * props.bool shows connection status  of  wallet if  provided.
   */
  connected: PropTypes.bool.isRequired,
  handleCardClick: PropTypes.func.isRequired,
  deleteWallet: PropTypes.func.isRequired,
  showDecryptWalletModal: PropTypes.func.isRequired,
  // setCurrentWallet: PropTypes.func.isRequired,
  isDecrypted: PropTypes.bool.isRequired,
  mnemonic: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  privateKey: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
};

export default WalletItemCard;

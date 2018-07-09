import { Icon, Dropdown, Popover } from 'antd';
import * as React from 'react';
import PropTypes from 'prop-types';
import DeletionModal from 'components/DeletionModal';
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
    };
    this.settingsMenu = this.settingsMenu.bind(this);
    this.handleDeleteWallet = this.handleDeleteWallet.bind(this);
  }

  settingsMenu() {
    return (
      <Menu>
        <MenuItem onClick={() => this.setState({ modalVisibility: true })}>Export Seed Words</MenuItem>
        <MenuDivider />
        <MenuItem>Export Password</MenuItem>
        <MenuDivider />
        <MenuItem onClick={() => this.setState({ modalVisibility: true })}>Delete Wallet</MenuItem>
      </Menu>
    );
  }

  handleDeleteWallet() {
    this.props.deleteWallet();
    this.setState({ modalVisibility: false });
  }

  render() {
    return (
      <OverflowHidden>
        <Modal
          footer={null}
          width={'585px'}
          maskClosable
          maskStyle={{ background: 'rgba(232,237,239,.65)' }}
          style={{ marginTop: '20px' }}
          visible={this.state.modalVisibility}
          onCancel={() => this.setState({ modalVisibility: false })}
          destroyOnClose
        >
          <DeletionModal
            type="wallet"
            onCancel={() => this.setState({ modalVisibility: false })}
            onDelete={this.handleDeleteWallet}
            name={this.props.name}
            address={this.props.primaryAddress}
          />
        </Modal>
        {this.props.connected !== undefined && <USBFlag connected={this.props.connected} />}
        <SpaceBetween>
          <CardIcon>
            <Popover
              placement="right"
              trigger="hover"
              content={
                <WalletDetailPopoverContent
                  address={this.props.primaryAddress}
                  type={this.props.type}
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
        <OuterWrapper onClick={() => { this.props.handleCardClick(this.props.primaryAddress); }}>
          <LeftSideWrapper>
            <p>{this.props.name}</p>
            <AssetsWrapper>
              {this.props.assets &&
              this.props.assets.map((asset) => (
                <AssetWrapper key={asset.name}>
                  <AssetAmountBubble name={asset.name} amount={asset.amount} />
                </AssetWrapper>
              ))}
            </AssetsWrapper>
          </LeftSideWrapper>
          <TotalBalance>{`$${this.props.totalBalance.toLocaleString('en')}`}</TotalBalance>
        </OuterWrapper>
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
  connected: PropTypes.bool,
  handleCardClick: PropTypes.func,
  deleteWallet: PropTypes.func,
};

export default WalletItemCard;

import { Icon, Dropdown, Popover } from 'antd';
import * as React from 'react';
import PropTypes from 'prop-types';
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

/**
 * This component shows details of a wallet in the card.
 */

const settingsMenu = () => (
  <Menu>
    <MenuItem>Export Seed Words</MenuItem>
    <MenuDivider />
    <MenuItem>Export Password</MenuItem>
    <MenuDivider />
    <MenuItem onClick={(e) => { e.domEvent.stopPropagation(); }}>Delete Wallet</MenuItem>
  </Menu>
);

const WalletItemCard = (props) => (
  <OverflowHidden>
    {props.connected !== undefined && <USBFlag connected={props.connected} />}
    <OuterWrapper onClick={() => { props.handleCardClick(props.primaryAddress); }}>
      <LeftSideWrapper>
        <p>{props.name}</p>
        <AssetsWrapper>
          {props.assets &&
            props.assets.map((asset) => (
              <AssetWrapper key={asset.name}>
                <AssetAmountBubble name={asset.name} amount={asset.amount} />
              </AssetWrapper>
            ))}
        </AssetsWrapper>
      </LeftSideWrapper>
      <TotalBalance>{`$${props.totalBalance.toLocaleString('en')}`}</TotalBalance>
      <SpaceBetween>
        <CardIcon>
          <Popover
            placement="right"
            trigger="hover"
            content={
              <WalletDetailPopoverContent
                address={props.primaryAddress}
                type={props.type}
              />
            }
          >
            <Icon type="info-circle-o" />
          </Popover>
        </CardIcon>
        <CardIconSettings>
          <Dropdown
            placement="bottomLeft"
            overlay={settingsMenu(props.primaryAddress)}
          >
            <Icon type="setting" />
          </Dropdown>
        </CardIconSettings>
      </SpaceBetween>
    </OuterWrapper>
  </OverflowHidden>
);

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
};

export default WalletItemCard;

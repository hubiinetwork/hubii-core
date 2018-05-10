import * as React from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import {
  ButtonDiv,
  Wrapper,
  TitleDiv,
  Description,
  Arrow,
  IconWrapper,
  DisabledButton,
  TextWhite
} from './AddRestoreWalletModal.style';
import { AddWallet } from './AddWallet';
import { RestoreWallet } from './RestoreWallet';
/**
 * This component shows options for modals to  be opened.
 */
export default class AddRestoreWalletModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      type: 'main'
    };
  }
  render() {
    const { type } = this.state;
    return (
      <div>
        {type === 'main' && (
          <div>
            <TitleDiv>
              Add / Restore Wallet<br />
              <Description>Please select what you want to do</Description>
            </TitleDiv>

            <ButtonDiv onClick={() => this.switchModals('add')} type="primary">
              <Wrapper>
                <Icon type="plus" />
                <TextWhite>Add Wallet</TextWhite>
              </Wrapper>
            </ButtonDiv>
            <ButtonDiv
              onClick={() => this.switchModals('restore')}
              type="primary"
            >
              <Wrapper>
                <Icon type="sync" />
                Restore Wallet
              </Wrapper>
            </ButtonDiv>
            <DisabledButton type="primary">
              <Wrapper>
                <Icon type="download" />
                Import Wallet
              </Wrapper>
            </DisabledButton>
          </div>
        )}
        {type === 'add' && (
          <div>
            <IconWrapper>
              <Arrow
                type="arrow-left"
                onClick={() => this.switchModals('main')}
              />New Hubii Wallet
            </IconWrapper>
            <AddWallet handleClose={this.props.handleClose} />
          </div>
        )}
        {type === 'restore' && (
          <div>
            <IconWrapper>
              <Arrow
                type="arrow-left"
                onClick={() => this.switchModals('main')}
              />Restore Wallet
            </IconWrapper>
            <RestoreWallet handleClose={this.props.handleClose} />
          </div>
        )}
      </div>
    );
  }
  switchModals = selectedType => {
    this.setState({ type: selectedType });
  };
}
AddRestoreWalletModal.propTypes = {
  /**
   * Callback  function triggered when modal is closed.
   */
  handleClose: PropTypes.func
};

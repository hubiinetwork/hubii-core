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
  TextWhite,
  // RightTopButton,
  DescriptionWrapper,
  TextGrey,
  Info,
} from './AddRestoreWalletModal.style';
import { AddWallet } from './AddWallet';
import { RestoreWallet } from './RestoreWallet';
import ImportWalletSteps from '../ImportWalletSteps';
/**
 * This component shows options for modals to  be opened.
 */
export default class AddRestoreWalletModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      type: 'main',
    };
    this.switchModals = this.switchModals.bind(this);
  }
  switchModals(selectedType) {
    this.setState({ type: selectedType });
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

            <ButtonDiv onClick={() => this.switchModals('import')} type="primary">
              <Wrapper>
                <Icon type="download" />
                <TextWhite>Import Wallet</TextWhite>
              </Wrapper>
            </ButtonDiv>

            <ButtonDiv onClick={() => this.switchModals('add')} type="primary">
              <Wrapper>
                <Icon type="plus" />
                <TextWhite>Create New Wallet</TextWhite>
              </Wrapper>
            </ButtonDiv>

            <ButtonDiv
              onClick={() => this.switchModals('restore')}
              type="primary"
            >
              <Wrapper>
                <Icon type="sync" />
                <TextWhite>Restore Wallet</TextWhite>
              </Wrapper>
            </ButtonDiv>

            <DescriptionWrapper>
              <div style={{ display: 'flex', width: '47%' }}>
                <Info type="info-circle-o" />
                <TextGrey>
                  Description of what each option do, lorem ipsum dolor sit amet
                  lorem ipsum dolor sit amet.
                </TextGrey>
              </div>
            </DescriptionWrapper>
          </div>
        )}
        {type === 'add' && (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <IconWrapper>
                <Arrow
                  type="arrow-left"
                  onClick={() => this.switchModals('main')}
                />New Hubii Wallet
              </IconWrapper>
              {/* <RightTopButton
                onClick={() => this.switchModals('import')}
                type="primary"
              >
                <Wrapper>
                  <Icon type="download" />
                  <TextWhite>Import Wallet</TextWhite>
                </Wrapper>
              </RightTopButton> */}
            </div>
            <AddWallet handleSubmit={this.props.handleAddWalletSubmit} />
          </div>
        )}
        {type === 'restore' && (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <IconWrapper>
                <Arrow
                  type="arrow-left"
                  onClick={() => this.switchModals('main')}
                />Restore Wallet
              </IconWrapper>
            </div>
            <RestoreWallet />
          </div>
        )}
        {type === 'import' && (
          <div>
            <ImportWalletSteps
              wallets={[
                {
                  src:
                    'https://www.ledger.fr/wp-content/uploads/2017/09/Ledger_logo_footer@2x.png',
                  name: 'ledger',
                },
                {
                  src: 'https://new.consensys.net/wp-content/uploads/2018/01/Metamask.png',
                  name: 'metamask',
                },
              ]}
              onBackIcon={() => this.switchModals('main')}
              handleSubmit={this.props.handleImportWalletSubmit}
            />
          </div>
        )}
      </div>
    );
  }
}
AddRestoreWalletModal.propTypes = {
  /**
   * Callback  function triggered when modal is closed.
   */
  handleAddWalletSubmit: PropTypes.func,
  handleImportWalletSubmit: PropTypes.func,
};

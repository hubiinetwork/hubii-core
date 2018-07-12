import * as React from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import { getAbsolutePath } from 'utils/electron';

import {
  ButtonDiv,
  Wrapper,
  TitleDiv,
  Description,
  Arrow,
  IconWrapper,
  TextWhite,
  DescriptionWrapper,
  TextGrey,
  Info,
} from './AddRestoreWalletModal.style';
import { AddWallet } from './AddWallet';
import ImportWalletSteps from '../ImportWalletSteps';

/**
 * This component shows options for modals to be opened.
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
    const { loading } = this.props;
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
            </div>
            <AddWallet loading={loading.toJS().creatingWallet} handleSubmit={this.props.handleAddWalletSubmit} />
          </div>
        )}
        {type === 'import' && (
          <div>
            <ImportWalletSteps
              wallets={[
                {
                  src: getAbsolutePath('public/Images/ledger_wallet.png'),
                  name: 'ledger',
                },
                {
                  src: getAbsolutePath('public/Images/metamask_wallet.png'),
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

  /**
   * loading
   */

  loading: PropTypes.object,
};

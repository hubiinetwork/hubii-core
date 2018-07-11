import React from 'react';
import PropTypes from 'prop-types';
import CopyToClipboard from 'react-copy-to-clipboard';
import Notification from '../Notification';

import {
  Text,
  TextPrimary,
  Wrapper,
  ParentDiv,
  SecondaryHeader,
  StyledButton,
  StyledIcon,
} from './ExportPrivateInfo.style';

/**
 * ExportPrivateInfo
 */
export default class ExportPrivateInfo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.showNotification = this.showNotification.bind(this);
  }

  showNotification(type) {
    const success = true;
    const message = `${type} copied to clipboard.`;
    Notification(success, message);
  }

  render() {
    const { name, address, mnemonic, privateKey, onExit } = this.props;
    return (
      <Wrapper>
        <Text> Export Private Information?</Text>
        <TextPrimary>
          <div>
            <SecondaryHeader>
              Wallet Name
            <CopyToClipboard text={name}>
              <StyledIcon
                type="primary"
                shape="circle"
                icon="copy"
                size={'small'}
                onClick={() => this.showNotification('Wallet Name')}
                id="name"
              />
            </CopyToClipboard>
            </SecondaryHeader>
            {name}
          </div>
          <div>
            <SecondaryHeader>
              Primary Address
            <CopyToClipboard text={address}>
              <StyledIcon
                type="primary"
                shape="circle"
                icon="copy"
                size={'small'}
                onClick={() => this.showNotification('Address')}
                id="address"
              />
            </CopyToClipboard>
            </SecondaryHeader>
            {address}
          </div>
          <div>
            <SecondaryHeader>
              Mnemonic
            <CopyToClipboard text={mnemonic} >
              <StyledIcon
                type="primary"
                shape="circle"
                icon="copy"
                size={'small'}
                onClick={() => this.showNotification('Mnemonic')}
                id="mnemonic"
              />
            </CopyToClipboard>
            </SecondaryHeader>
            {mnemonic}
          </div>
          <div>
            <SecondaryHeader>
              Private Key
            <CopyToClipboard text={privateKey} >
              <StyledIcon
                type="primary"
                shape="circle"
                icon="copy"
                size={'small'}
                onClick={() => this.showNotification('Private key')}
                id="privateKey"
              />
            </CopyToClipboard>
            </SecondaryHeader>
            {privateKey}
          </div>
        </TextPrimary>
        <ParentDiv>
          <StyledButton type="primary" onClick={onExit} id="exit">
            Exit
          </StyledButton>
        </ParentDiv>
      </Wrapper>
    );
  }
}

ExportPrivateInfo.propTypes = {
  /**
   * Function to perform action when exit button is clicked
   */
  onExit: PropTypes.func.isRequired,
  /**
   * Wallet Name
   */
  name: PropTypes.string.isRequired,
  /**
   * Wallet Primary Address
   */
  address: PropTypes.string.isRequired,
  /**
   * Wallet mnemonic
   */
  mnemonic: PropTypes.string,
  /**
   * Wallet private key
   */
  privateKey: PropTypes.string,
};

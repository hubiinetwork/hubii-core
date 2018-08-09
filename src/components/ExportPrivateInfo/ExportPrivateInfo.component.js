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
  PrimaryHeader,
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
    const { mnemonic, privateKey, onExit } = this.props;
    return (
      <Wrapper>
        <Text>Never share this information with anyone</Text>
        <Text>Always keep a physical backup in a safe location</Text>
        <TextPrimary>
          {
              mnemonic ?

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
                </div> :
                <div>
                  <PrimaryHeader>
                    Mnemonic
                  </PrimaryHeader>
                  This wallet was imported using a private key therefore does not have a mnemonic to export
                </div>
            }
          <div>
            <SecondaryHeader>
              Private key
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
            Close
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
   * Wallet mnemonic
   */
  mnemonic: PropTypes.string,
  /**
   * Wallet private key
   */
  privateKey: PropTypes.string,
};

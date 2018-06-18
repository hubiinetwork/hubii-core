import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyledQRCode, Wrapper, Logo } from './QRCodeModal.style';

/**
 * This component contains the inside content of QRcode modal
 */
const QRCodeModal = ({ qrCodeValue }) => (
  <div>
    <Text>
      Connect with{' '}
      <Logo alt="hubii film logo" src="public/Images/hubii_film_logo.png" />
    </Text>
    <Wrapper>
      <StyledQRCode value={qrCodeValue} />
      <Text>
        Scan the QR code on Hubii Film App on your smartphone to connect your
        Striim Account
      </Text>
    </Wrapper>
  </div>
);
export default QRCodeModal;

QRCodeModal.propTypes = {
  /**
   * Value of qr code
   */
  qrCodeValue: PropTypes.string,
};

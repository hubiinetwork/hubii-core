import React from 'react';
import QRCode from 'qrcode.react';
import { Text, StyledQRCode, Wrapper, Logo } from './QRCodeModal.style';

const QRCodeModal = () => (
  <div>
    <Text>
      Connect with{' '}
      <Logo alt="hubii film logo" src="public/Images/hubii_film_logo.png" />
    </Text>
    <Wrapper>
      <StyledQRCode value="Striim Account 2" />
      <Text>
        Scan the QR code on Hubii Film App on your smartphone to connect your
        Striim Account
      </Text>
    </Wrapper>
  </div>
);
export default QRCodeModal;

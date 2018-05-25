import React from 'react';
import QRCode from 'qrcode.react';
import { Text, StyledQRCode, Wrapper } from './QRCodeModal.style';

const QRCodeModal = () => (
  <div>
    <Text>
      Connect with <img src="public/Images/hubii-film-logo.png" />
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

import styled from 'styled-components';
import QRCode from 'qrcode.react';

export const Text = styled.div`
  color: ${({ theme }) => theme.palette.light};
`;

export const StyledQRCode = styled(QRCode)`
  padding: 0.5rem;
  background-color: #ffffff;
  display: inline-block;
  margin: 1.7rem;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 15rem;
  text-align: center;
`;

import styled from 'styled-components';
import QRCode from 'qrcode.react';

export const Text = styled.div`
  color: ${({ theme }) => theme.palette.light};
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.14rem;
`;

export const StyledQRCode = styled(QRCode)`
  padding: 0.5rem;
  background-color: #ffffff;
  display: inline-block;
  margin: 1.7rem;
  height: 10.64rem !important;
  width: 10.5rem !important;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 16rem;
  text-align: center;
  margin: 1rem;
`;
export const Logo = styled.img`
  margin-top: -0.71rem;
`;

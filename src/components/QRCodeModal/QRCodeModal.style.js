import styled from 'styled-components';
import QRCode from 'qrcode.react';

export const Text = styled.div`
  color: ${({ theme }) => theme.palette.light};
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
`;

export const StyledQRCode = styled(QRCode)`
  padding: 0.5rem;
  background-color: #ffffff;
  display: inline-block;
  margin: 1.7rem;
  height: 149px !important;
  width: 147px !important;
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
  margin-top: -10px;
`;

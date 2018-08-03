import styled from 'styled-components';
import { Col } from 'antd';

export const WalletCardsCol = styled(Col)`
  margin-bottom: 1rem;
`;

export const Wrapper = styled.div`
  margin-left: 2rem;
`;
export const WalletPlaceHolder = styled.div`
  color: ${({ theme }) => theme.palette.secondary};
  font-size: 1.25rem;
`;

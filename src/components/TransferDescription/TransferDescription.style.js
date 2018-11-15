import { Col, Spin } from 'antd';
import styled from 'styled-components';

import Button from 'components/ui/Button';
import Text from 'components/ui/Text';

export const HWPromptWrapper = styled.div`
  margin-top: 2rem;
`;

export const StyledButton = styled(Button)`
  margin-top: 2rem;
  width: 11.57rem;
`;

export const StyledCol = styled(Col)`
  margin-top: 1.43rem;
  margin-bottom: 0.43rem;
  white-space: nowrap;
  color: ${({ theme }) => theme.palette.secondary};
`;

export const StyledRecipient = styled(Col)`
  color: ${({ theme }) => theme.palette.light};
`;

export const Balance = styled(Text)`
  width: 8rem;
  color: ${({ theme }) => theme.palette.light};
`;

export const StyledSpin = styled(Spin)`
  margin-top: 2rem;
  &.ant-spin.ant-spin-show-text .ant-spin-text{
    margin-top:1.5rem;
  }
  color: white;
`;

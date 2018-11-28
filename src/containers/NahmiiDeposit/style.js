import styled from 'styled-components';
import Button from 'components/ui/Button';
import { Col, Spin } from 'antd';

import Text from 'components/ui/Text';

export const AdvancedSettingsHeader = styled(Text)`
  color: ${({ theme }) => theme.palette.info};
`;

export const Image = styled.img`
  width: 2.35rem;
  height: 2.35rem;
  border-bottom: 0.07rem solid ${({ theme }) => theme.palette.secondary};
  padding-bottom: 0.29rem;
`;

export const DollarPrice = styled(Text)`
  color: ${({ theme }) => theme.palette.secondary};
`;

export const StyledCol = styled(Col)`
  margin-top: 1.43rem;
  margin-bottom: 0.43rem;
  white-space: nowrap;
  color: ${({ theme }) => theme.palette.secondary};
`;

export const StyledButton = styled(Button)`
  margin-top: 2rem;
  width: 11.57rem;
`;

export const StyledSpin = styled(Spin)`
  margin-top: 2rem;
  &.ant-spin.ant-spin-show-text .ant-spin-text {
    margin-top:1.5rem;
  }
  color: white;
`;

export const HWPromptWrapper = styled.div`
  margin-top: 2rem;
`;

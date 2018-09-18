import { Col, Spin } from 'antd';
import styled from 'styled-components';

import Button from 'components/ui/Button';

export const HWPromptWrapper = styled.div`
  margin-top: 2rem;
`;

export const StyledButton = styled(Button)`
  margin-top: 2rem;
  width: 11.57rem;
`;

export const StyledTitle = styled(Col)`
  color: ${({ theme }) => theme.palette.info3};
  font-size: 0.86rem;
  font-weight: 400;
  line-height: 1rem;
  white-space: nowrap;
`;

export const StyledCol = styled(Col)`
  font-size: 0.86rem;
  font-weight: 400;
  line-height: 1rem;
  margin-top: 1.43rem;
  margin-bottom: 0.43rem;
  white-space: nowrap;
  color: ${({ theme }) => theme.palette.secondary};
`;

export const StyledErrorCol = styled(Col)`
  font-size: 0.86rem;
  font-weight: 400;
  line-height: 1rem;
  margin-top: 1.43rem;
  margin-bottom: 0.43rem;
  color: ${({ theme }) => theme.palette.secondary};
`;

export const StyledRecipient = styled(Col)`
  color: ${({ theme }) => theme.palette.light};
`;

export const BalanceCol = styled(Col)`
  height: 1.5rem;
  width: 8rem;
  color: ${({ theme }) => theme.palette.light};
  font-size: 1.29rem;
  font-weight: 400;
  line-height: 1.5rem;
`;
export const WrapperDiv = styled.div`
  /* margin-left: 1rem; */
`;
export const StyledSpin = styled(Spin)`
  margin-top: 2rem;
  &.ant-spin.ant-spin-show-text .ant-spin-text{
    margin-top:1.5rem;
  }
  color: white;
`;

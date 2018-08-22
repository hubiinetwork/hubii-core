import { Col, Spin } from 'antd';
import styled from 'styled-components';
import Button from '../ui/Button';

export const HWPromptWrapper = styled.div`
  margin-top: 2rem;
`;

export const StyledButton = styled(Button)`
  height: 2.86rem;
  width: 11.57rem;
  margin-top: 4.93rem;
  border: 0.14rem solid ${({ theme }) => theme.palette.info3};
  border-radius: 0.29rem;
  background-color: ${({ disabled: white }) =>
    white && 'transparent !important'};
  border: ${({ disabled: white, theme }) =>
    white && `0.14rem solid ${theme.palette.secondary4} !important`};
  color: ${({ disabled: white, theme }) =>
    white
      ? `${theme.palette.secondary4} !important`
      : `${theme.palette.light} !important`};
  &:hover {
    background-color: ${({ disabled: white }) =>
      white && 'transparent !important'};
    border: ${({ disabled: white, theme }) =>
      white && `0.14rem solid ${theme.palette.secondary4} !important`};
  }
`;
export const StyledButtonCancel = styled(Button)`
  height: 2.86rem;
  width: 5rem;
  margin-right: 0.57rem;
  border-radius: 0.29rem;
  background: ${({ theme }) => theme.palette.primary1};
  color: ${({ theme }) => theme.palette.light};
  border: 0.07rem solid ${({ theme }) => theme.palette.light};
  &:hover {
    border-radius: 0.29rem;
    background: ${({ theme }) => theme.palette.primary1};
    color: ${({ theme }) => theme.palette.light};
    border: 0.07rem solid ${({ theme }) => theme.palette.light};
`;
export const StyledTitle = styled(Col)`
  color: ${({ theme }) => theme.palette.info3};
  font-size: 0.86rem;
  font-weight: 500;
  line-height: 1rem;
  white-space: nowrap;
`;
export const StyledCol = styled(Col)`
  font-size: 0.86rem;
  font-weight: 500;
  line-height: 1rem;
  margin-top: 1.43rem;
  margin-bottom: 0.43rem;
  white-space: nowrap;
  color: ${({ theme }) => theme.palette.secondary};
`;
export const StyledErrorCol = styled(Col)`
  font-size: 0.86rem;
  font-weight: 500;
  line-height: 1rem;
  margin-top: 1.43rem;
  margin-bottom: 0.43rem;
  color: ${({ theme }) => theme.palette.secondary};
`;
export const StyledRecipient = styled(Col)`
  color: ${({ theme }) => theme.palette.light};
`;
export const SendCancelWrapper = styled.div`
  display: flex;
  margin-top: 2rem;
`;
export const BalanceCol = styled(Col)`
  height: 1.5rem;
  width: 8rem;
  color: ${({ theme }) => theme.palette.light};
  font-size: 1.29rem;
  font-weight: 500;
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

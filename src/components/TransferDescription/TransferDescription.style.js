import { Col, Spin } from 'antd';
import styled from 'styled-components';
import Button from '../ui/Button';

export const StyledButton = styled(Button)`
  height: 2.86rem;
  width: 11.57rem;
  margin-top: 4.93rem;
  font-family: 'SF Text';
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
  min-width: 5rem;
  margin-top: 4.93rem;
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
export const StyledCancelButton = styled(Button)`
  border-width: 0.14rem;
  padding: 0.5rem 1rem;
  margin: 1rem 0;
  &:hover,
  &:focus {
    color: ${({ theme }) => theme.palette.light};
    opacity: 0.7;
    border-color: ${({ theme }) => theme.palette.light} !important;
    color: ${({ theme }) => theme.palette.info};
  }
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
export const StyledDiv = styled.div`
  display: flex;
  justify-content: flex-start;
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
  margin-left: 1rem;
`;
export const StyledSpin = styled(Spin)`
  margin-top: 2rem;
  &.ant-spin.ant-spin-show-text .ant-spin-text{
    margin-top:1.5rem;
  }
  color: white;
`;

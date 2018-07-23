import { Col, Spin } from 'antd';
import styled from 'styled-components';
import Button from '../ui/Button';

export const StyledButton = styled(Button)`
  height: 40px;
  width: 162px;
  margin-top: 69px;
  font-family: 'SF Text';
  border: 2px solid ${({ theme }) => theme.palette.info3};
  border-radius: 4px;
  background-color: ${({ disabled: white }) =>
    white && 'transparent !important'};
  border: ${({ disabled: white, theme }) =>
    white && `2px solid ${theme.palette.secondary4} !important`};
  color: ${({ disabled: white, theme }) =>
    white
      ? `${theme.palette.secondary4} !important`
      : `${theme.palette.light} !important`};
  &:hover {
    background-color: ${({ disabled: white }) =>
      white && 'transparent !important'};
    border: ${({ disabled: white, theme }) =>
      white && `2px solid ${theme.palette.secondary4} !important`};
  }
`;
export const StyledButtonCancel = styled(Button)`
  height: 40px;
  width: 70px;
  min-width: 70px;
  margin-top: 69px;
  margin-right: 8px;
  border-radius: 4px;
  background: ${({ theme }) => theme.palette.primary1};
  color: ${({ theme }) => theme.palette.light};
  border: 1px solid ${({ theme }) => theme.palette.light};
  &:hover {
    border-radius: 4px;
    background: ${({ theme }) => theme.palette.primary1};
    color: ${({ theme }) => theme.palette.light};
    border: 1px solid ${({ theme }) => theme.palette.light};
`;
export const StyledCancelButton = styled(Button)`
  border-width: 2px;
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
  font-size: 12px;
  font-weight: 500;
  line-height: 14px;
  white-space: nowrap;
`;
export const StyledCol = styled(Col)`
  color: ${({ theme }) => theme.palette.secondary};
  font-size: 12px;
  font-weight: 500;
  line-height: 14px;
  margin-top: 20px;
  margin-bottom: 6px;
  white-space: nowrap;
`;
export const StyledRecipient = styled(Col)`
  color: ${({ theme }) => theme.palette.light};
`;
export const StyledDiv = styled.div`
  display: flex;
  justify-content: flex-start;
`;
export const BalanceCol = styled(Col)`
  height: 21px;
  width: 112px;
  color: ${({ theme }) => theme.palette.light};
  font-size: 18px;
  font-weight: 500;
  line-height: 21px;
`;
export const WrapperDiv = styled.div`
  width: 300px;
`;
export const StyledSpin = styled(Spin)`
  margin-top: 2rem;
  &.ant-spin.ant-spin-show-text .ant-spin-text{
    margin-top:1.5rem;
  }
  color: white;
`;

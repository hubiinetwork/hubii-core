import { Radio } from 'antd';
import styled from 'styled-components';
import Button from '../../ui/Button';

export const Coins = styled(Radio.Group)`
  margin-top: 2.86rem;
  padding-left: 1.93rem;
  padding-right: 1.93rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .ant-radio-button-wrapper-checked {
    background-color: ${({ theme }) => theme.palette.info};
    border: 0.07rem solid ${({ theme }) => theme.palette.info};
  }
`;
const RadioButton = Radio.Button;

export const CoinButton = styled(RadioButton)`
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1.07rem;
  padding-top: 0.57rem;
  background-color: transparent;
  width: 16.21rem;
  height: 3.43rem;
  border-radius: 0.21rem !important;
`;

export const Flex = styled.div`
  display: flex;
  color: ${({ theme }) => theme.palette.light};
`;

export const Image = styled.img`
  width: 6.43rem;
  height: 2.14rem;
`;

export const OptionText = styled.h3`
  color: white;
  vertical-align: center;
`;

export const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const SpanText = styled.span`
  font-size: 1.14rem;
  font-weight: 500;
  line-height: 1.36rem;
`;
export const ButtonDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.86rem;
  margin-top: 1rem;
`;
export const StyledButton = styled(Button)`
  margin-top: 2.5rem;
  background-color: ${({ disabled: white }) =>
    white && 'transparent !important'};
  font-size: 0.86rem;
  font-weight: 500;
  border-width: 0.14rem;
  height: 2.86rem;
  width: 11.57rem;
  border: ${({ disabled: white, theme }) =>
    white && `0.14rem solid ${theme.palette.secondary4} !important`};
  min-width: ${({ current: width }) => (width === 0 ? '18.57rem' : '18.57rem')};
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
export const StyledSpan = styled.span`
  font-size: 0.86rem;
  font-weight: 500;
  line-height: 1rem;
  text-align: center;
`;

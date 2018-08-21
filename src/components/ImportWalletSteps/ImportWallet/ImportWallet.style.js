import { Radio } from 'antd';
import styled from 'styled-components';
import Button from '../../ui/Button';

const RadioButton = Radio.Button;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Header = styled.p`
  &&& {
    color: white;
    text-align: center;
    font-size: 1.7rem;
    margin-top: 4rem;
    margin-bottom: 1rem;
  }
`;

export const Coins = styled(Radio.Group)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  .ant-radio-button-wrapper-checked {
    border: 0.14rem solid ${({ theme }) => theme.palette.info};
    box-shadow: none;
    transition: box-shadow 0s ease;
  }
`;

export const CoinButton = styled(RadioButton)`
  padding: 0.5rem;
  margin: 1rem;
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
  max-width: 11rem;
  max-height: 2.5rem;
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

export const StyledButton = styled(Button)`
  margin-top: 1.5rem;
  margin-bottom: 2rem;
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

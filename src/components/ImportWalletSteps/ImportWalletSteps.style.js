import styled from 'styled-components';
import { Icon } from 'antd';
import Button from '../ui/Button';

export const SpaceBetween = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const ButtonDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  margin-top: 1rem;
`;
export const StyledButton = styled(Button)`
  background-color: ${({ disabled: white }) =>
    white && 'transparent !important'};
  font-size: 12px;
  font-weight: 500;
  border-width: 2px;
  height: 40px;
  width: 162px;
  border: ${({ disabled: white, theme }) =>
    white && `2px solid ${theme.palette.secondary4} !important`};
  min-width: ${({ current: width }) => (width === 0 ? '260px' : '190px')};
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
export const StyledBackButton = styled(Button)`
  height: 40px;
  width: 70px;
  margin-right: 8px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.palette.light};
`;
export const TextDiv = styled.div`
  display: flex;
  color: ${({ theme }) => theme.palette.secondary1};
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
  line-height: 14px;
  text-align: center;
  margin-top: 32px;
  margin-bottom: 12px;
`;
export const Between = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
export const CreateButton = styled(Button)`
  background-color: transparent;
  color: ${({ theme }) => theme.palette.light};
  height: 32px;
  width: 153px;
  &:hover {
    background-color: ${({ theme }) => theme.palette.info2};
    color: ${({ theme }) => theme.palette.light};
    border-color: ${({ theme }) => theme.palette.light};
  }
`;
export const LeftArrow = styled(Icon)`
  font-size: 20px;
  margin-right: 7px;
  cursor: pointer;
`;
export const Flex = styled.div`
  display: flex;
  color: ${({ theme }) => theme.palette.light};
`;
export const SpanText = styled.span`
  font-size: 16px;
  font-weight: 500;
  line-height: 19px;
`;

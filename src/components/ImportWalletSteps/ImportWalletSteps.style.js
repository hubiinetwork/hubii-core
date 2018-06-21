import styled from 'styled-components';
import Button from '../ui/Button';

export const SpaceBetween = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
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
export const StyledSpan = styled.span`
  font-size: 12px;
  font-weight: 500;
  line-height: 14px;
  text-align: center;
`;

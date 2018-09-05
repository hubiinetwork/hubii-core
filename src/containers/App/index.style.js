import styled from 'styled-components';
import Button from 'components/ui/Button';

export const TitleDiv = styled.div`
  font-size: 1.6rem;
  margin: 0 2rem;
  text-align: center;
  color: ${({ theme }) => theme.palette.light};
  font-weight: 400;
`;

export const Container = styled.div`
  padding: 2rem 0;
`;

export const TextWhite = styled.span`
  color: ${({ theme }) => theme.palette.light};
  height: 1rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1rem;
  text-align: center;
`;

export const ButtonDiv = styled(Button)`
  margin: auto;
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
  background-color: ${({ disabled: white }) =>
    white && 'transparent !important'};
  font-size: 0.86rem;
  font-weight: 400;
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


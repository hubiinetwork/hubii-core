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
  overflow-x: hidden;
  max-height: 400px;
  padding: 2rem 0;
  h1 {
    color: ${({ theme }) => theme.palette.light};
  }
  h2 {
    color: ${({ theme }) => theme.palette.light};
  }
  h3 {
    color: ${({ theme }) => theme.palette.light};
  }
`;

export const TextWhite = styled.span`
  color: ${({ theme }) => theme.palette.light};
  height: 1rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1rem;
  text-align: center;
`;

export const ButtonDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.loading ? '1.79rem' : '3.57rem'};
  margin-bottom: 1.86rem;
`;

export const StyledButton = styled(Button)`
  background-color: ${({ disabled: white }) =>
    white && 'transparent !important'};
  font-size: 0.86rem;
  font-weight: 400;
  border-width: 0.14rem;
  height: 2.86rem;
  width: 11.57rem;
  border: ${({ disabled: white, theme }) =>
    white && `0.14rem solid ${theme.palette.secondary4} !important`};
  min-width: ${({ current: width }) => (width === 0 ? '18.57rem' : '13.57rem')};
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

export const StyledDetailsButton = styled(Button)`
  height: 2.86rem;
  width: 10rem;
  margin-left: 0.57rem;
  margin-right: 0.57rem;
  border-radius: 0.29rem;
  border: 0.07rem solid ${({ theme }) => theme.palette.light};
`;

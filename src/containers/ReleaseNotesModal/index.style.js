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
  width: 11rem;
`;

export const StyledDetailsButton = styled(Button)`
  width: 9rem;
  margin-left: 2.57rem;
`;

import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Cards = styled.div`
  display: flex;
  margin-top: 4rem;
  max-width: 70rem;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center
`;

export const Logo = styled.img`
  width: 30rem;
`;

export const StyledLink = styled(Link)`
  display: flex;
  flex: 1;
  margin: 1rem;
`;

export const Wrapper = styled.div`
  display: flex;
  flex: 1;
  padding: 0 3rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.palette.primary1};
  overflow-x: hidden;
  overflow-y: scroll;
`;

import styled from 'styled-components';

export const Wrapper = styled.div`
  text-align: center;
  font-size: 0.86rem;
  font-weight: 500;
  line-height: 1.36rem;
  color: ${({ theme }) => theme.palette.secondary1};
  width: 30rem;
`;

export const Term = styled.a`
  color: ${({ theme }) => theme.palette.light};
  text-decoration: underline;
  &:hover {
    text-decoration: underline;
  }
`;

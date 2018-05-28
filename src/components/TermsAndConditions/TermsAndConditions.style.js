import styled from 'styled-components';

export const Wrapper = styled.div`
  text-align: center;
  font-size: 10px;
  color: ${({ theme }) => theme.palette.secondary1};
  width: 36%;
`;

export const Term = styled.a`
  color: ${({ theme }) => theme.palette.light};
  text-decoration: underline;
  &:hover {
    text-decoration: underline;
  }
`;

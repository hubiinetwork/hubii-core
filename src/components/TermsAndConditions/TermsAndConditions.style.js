import styled from 'styled-components';

export const Wrapper = styled.div`
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  line-height: 19px;
  color: ${({ theme }) => theme.palette.secondary1};
  width: 420px;
`;

export const Term = styled.a`
  color: ${({ theme }) => theme.palette.light};
  text-decoration: underline;
  &:hover {
    text-decoration: underline;
  }
`;

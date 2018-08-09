import styled from 'styled-components';

export const Label = styled.span`
  color: ${({ theme }) => theme.palette.light};
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.14rem;
`;

export const Value = styled.span`
  color: ${({ theme }) => theme.palette.secondary1};
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.14rem;
  text-align: right;
`;

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

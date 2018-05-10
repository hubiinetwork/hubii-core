import styled from "styled-components";

export const Label = styled.span`
  color: ${({ theme }) => theme.palette.light};
`;

export const Value = styled.span`
  color: ${({ theme }) => theme.palette.secondary1};
`;

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

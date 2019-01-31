import styled from 'styled-components';

export const HelperWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
`;

export const Text = styled.span`
  font-size: 1rem;
  color: ${({ theme }) => theme.palette.secondary1};
`;

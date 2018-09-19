import styled from 'styled-components';

export const OuterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  background: ${({ theme }) => theme.palette.dark1}
`;

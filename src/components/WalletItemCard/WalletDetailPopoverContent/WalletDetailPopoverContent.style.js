import styled from 'styled-components';

export const Subtitle = styled.div`
  color: ${({ theme }) => theme.palette.secondary1};
  font-size: 14px;
  margin-bottom: 18px;
  &:last-child {
    margin-bottom: 0;
  }
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.palette.primary1};
  color: ${({ theme }) => theme.palette.light};
  font-size: 18px;
`;

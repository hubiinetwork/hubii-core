import styled from 'styled-components';

export const StyledDiv = styled.div`
  color: ${({ theme }) => theme.palette.light};
  display: flex;
  font-size: 1.21rem;
  justify-content: space-between;
  position: relative;
  height: 2.29rem;
`;
export const Wrapper = styled.div`
  width: 30%;
  margin-right: 0.71rem;
  position: absolute;
  right: 0;
`;

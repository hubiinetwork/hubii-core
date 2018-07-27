import styled from 'styled-components';

export const StyledDiv = styled.div`
  color: ${({ theme }) => theme.palette.light};
  display: flex;
  font-size: 17px;
  justify-content: space-between;
  position: relative;
  height: 32px;
`;
export const Wrapper = styled.div`
  width: 30%;
  margin-right: 10px;
  position: absolute;
  right: 0;
`;

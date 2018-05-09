import styled from "styled-components";

export const StyledDiv = styled.div`
  color: ${({ theme }) => theme.palette.light};
  display: flex;
  font-size: 17px;
  margin-top: -7px;
  margin-left: 15px;
  justify-content: space-between;
`;
export const Wrapper = styled.div`
  max-width: 60%;
  margin-right: 10px;
`;

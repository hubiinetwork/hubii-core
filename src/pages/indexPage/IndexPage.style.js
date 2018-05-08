import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  padding-top: 150px;
  background-color: ${({ theme }) => theme.palette.primary1};
`;

const StyledCard = styled.div`
  margin-top: 35px;
  text-align: center;
`;

const StyledDashboardImage = styled.img`
  margin: auto;
  display: flex;
  width: 248px;
  height: auto;
`;
export { Wrapper, StyledDashboardImage, StyledCard };

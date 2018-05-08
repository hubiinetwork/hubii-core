import { Affix } from "antd";
import styled from "styled-components";
const StyledAffix = styled(Affix)`
  display: inline-flex;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.palette.dark3};
  padding-right: 5px;
  padding-left: 5px;
  bottom: 15px;
  right: 15px;
  position: fixed;
`;

const StyledStatusLabel = styled.span`
  color: ${({ theme }) => theme.palette.secondary1};
`;

const StyledStatus = styled.span`
  color: ${({ children: status }) => {
    if (status === "online") {
      return "green";
    } else if (status === "offline") {
      return "red";
    } else if (status === "connecting") {
      return "yellow";
    }
  }};
`;
export { StyledAffix, StyledStatus, StyledStatusLabel };

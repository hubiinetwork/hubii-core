import { Input } from "antd";
import styled from "styled-components";

export default styled(Input)`
  background-color: transparent;
  border: none;
  border-radius: 0px;
  padding: 0px;
  color: ${({ theme }) => theme.palette.light};
  border-bottom: 1px solid ${({ theme }) => theme.palette.secondary};

  &:hover {
    border-color: ${({ theme }) => theme.palette.secondary};
  }

  &:focus {
    border-color: ${({ theme }) => theme.palette.secondary};
    outline: none;
    color: ${({ theme }) => theme.palette.info};
    box-shadow: none;
  }
`;

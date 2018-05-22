import { Input } from "antd";
import styled from "styled-components";
const Search = Input.Search;
export const InputSearch = styled(Search)`
  &:hover {
    input {
      border-color: ${({ theme }) => theme.palette.secondary} !important;
    }
  }
  input.ant-input {
    color: ${({ theme }) => theme.palette.info};
    background: ${({ theme }) => theme.palette.primary1};
    border-color: ${({ theme }) => theme.palette.secondary2};
    &:hover {
      border-color: ${({ theme }) => theme.palette.secondary} !important;
    }
    &:focus {
      border-color: ${({ theme }) => theme.palette.secondary1} !important;
    }
  }
  button.ant-btn.ant-input-search-button.ant-btn-primary {
    background: ${({ theme }) => theme.palette.primary1};
    &:hover {
      border-color: ${({ theme }) => theme.palette.secondary} !important;
    }
    &:focus {
      border-color: ${({ theme }) => theme.palette.secondary} !important;
    }
  }
  .ant-btn-primary {
    border-color: ${({ theme }) => theme.palette.secondary2};
  }
`;

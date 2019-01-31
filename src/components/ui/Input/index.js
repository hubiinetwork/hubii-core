import { Input } from 'antd';
import styled from 'styled-components';

export default styled(Input)`
  background-color: transparent;
  border: none;
  border-radius: 0rem;
  padding: 0rem;
  color: ${({ theme }) => theme.palette.light};
  border-bottom: 0.07rem solid ${({ theme }) => theme.palette.secondary};

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

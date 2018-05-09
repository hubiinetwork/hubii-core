import { Select } from "antd";
import styled from "styled-components";

export const Option = Select.Option;
export const OptGroup = Select.OptGroup;

export default styled(Select)`
  background-color: transparent;
  border: none;
  border-radius: 0px;
  padding: 0px;
  color: ${({ theme }) => theme.palette.light};
  border-bottom: 1px solid ${({ theme }) => theme.palette.secondary};
  .ant-select-selection__rendered {
    margin: 0px;
  }
  &:hover {
    border-color: ${({ theme }) => theme.palette.secondary};
  }

  &:focus {
    border-color: ${({ theme }) => theme.palette.secondary};
    outline: none;
    box-shadow: none;
  }
  .ant-select-selection:focus {
    .ant-select-selection-selected-value {
      color: ${({ theme }) => theme.palette.info} !important;
    }
  }
  .ant-select-selection {
    background-color: transparent;
    border: none;
  }
  .ant-select-selection:active {
    box-shadow: none;
  }
  .ant-select-selection:focus {
    box-shadow: none;
  }

  .ant-select-arrow {
    color: ${({ theme }) => theme.palette.light};
  }
`;

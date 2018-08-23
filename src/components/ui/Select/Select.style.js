import { Select } from 'antd';
import styled from 'styled-components';

export const Option = Select.Option;
export const OptGroup = Select.OptGroup;

export default styled(Select)`
  background-color: transparent;
  border: none;
  border-radius: 0rem;
  padding: 0rem;
  color: ${({ theme }) => theme.palette.light};
  padding-left: ${({ recipient }) => (recipient ? '0rem' : '1rem')};
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-bottom: 0.07rem solid ${({ theme }) => theme.palette.secondary};
  .ant-select-selection__rendered {
    margin: 0rem;
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

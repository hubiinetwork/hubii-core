import styled from 'styled-components';
import { Icon, Select } from 'antd';

export const Text = styled.div`
  color: ${({ theme }) => theme.palette.info};
  line-height: 20px;
`;

export const TextPrimary = styled.div`
  color: black;
  line-height: 20px;
`;

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.2rem;
  padding-right: 0.8rem;
`;

export const StyledIcon = styled(Icon)`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.palette.secondary4};
`;

export const StyledSelect = styled(Select)`
  .ant-select-selection {
    background-color: ${({ theme }) => theme.palette.primary4};
    height: 50px;
    border-color: ${({ theme }) => theme.palette.secondary4};
  }
  .ant-select-arrow {
    color: ${({ theme }) => theme.palette.light};
  }
  .ant-select-selection-selected-value {
    float: none;
  }
  &.ant-select-dropdown-menu-item {
    background-color: ${({ theme }) => theme.palette.primary4};
  }
  .white {
    color: ${({ theme }) => theme.palette.light};
  }
`;

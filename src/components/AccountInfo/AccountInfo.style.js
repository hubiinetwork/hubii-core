import styled from 'styled-components';
import { Icon, Select } from 'antd';

export const Text = styled.div`
  color: ${({ theme }) => theme.palette.info3};
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
`;

export const TextPrimary = styled.div`
  color: black;
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
`;

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
`;

export const StyledIcon = styled(Icon)`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.palette.secondary4};
  position: absolute;
  top: 16px;
  right: 30px;
  z-index: 2;
`;

export const StyledSelect = styled(Select)`
  .ant-select-selection {
    background-color: ${({ theme }) => theme.palette.primary1};
    height: 51px;
    border-color: ${({ theme }) => theme.palette.secondary4};
  }
  .ant-select-arrow {
    color: ${({ theme }) => theme.palette.light};
  }
  .ant-select-selection-selected-value {
    float: none;
  }
  &.ant-select-dropdown-menu-item {
    background-color: ${({ theme }) => theme.palette.primary1};
  }
  .white {
    color: ${({ theme }) => theme.palette.light};
  }
  .hide {
    display: none;
  }
`;

import { Icon, Radio, Table } from 'antd';
import styled from 'styled-components';
import Button from '../../ui/Button';
import { ModalFormItem } from '../../ui/Modal';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
export const Address = styled.span`
  margin-left: -22px;
`;
export const Between = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CreateButton = styled(Button)`
  background-color: transparent;
  color: ${({ theme }) => theme.palette.light};
  height: 32px;
  width: 153px;
  &:hover {
    background-color: ${({ theme }) => theme.palette.info2};
    color: ${({ theme }) => theme.palette.light};
    border-color: ${({ theme }) => theme.palette.light};
  }
`;

export const LeftArrow = styled(Icon)`
  font-size: 20px;
  margin-right: 7px;
  cursor: pointer;
`;

export const Flex = styled.div`
  display: flex;
  color: ${({ theme }) => theme.palette.light};
`;

export const SpanText = styled.span`
  font-size: 16px;
  font-weight: 500;
  line-height: 19px;
`;

export const PathTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
  color: ${({ theme }) => theme.palette.secondary1};
`;

export const PathSubtitle = styled.div`
  font-size: 12px;
  font-weight: 500;
  line-height: 14px;
  color: ${({ theme }) => theme.palette.secondary6};
`;

export const PathWrapper = styled.div`
  margin-top: -5px;
  margin-left: 7px;
  width: 149px;
  color: ${({ theme }) => theme.palette.secondary6};
`;

export const Radios = styled.div`
  margin-left: 1.3px;
`;

export const RadioTitle = styled.div`
  color: ${({ theme }) => theme.palette.light};
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
  margin-top: 23px;
`;

export const RadioButtonWrapper = styled.div`
  display: flex;
  margin-top: 26px;
  min-width: 240px;
  .ant-radio-button-wrapper-checked {
    background-color: ${({ theme }) => theme.palette.info} !important;
    border: 0px;
    span i {
      display: flex !important;
    }
  }
`;

export const Tick = styled(Icon)`
  color: white;
  font-size: 11px;
  font-weight: 700;
`;

export const StyledRadio = styled(RadioButton)``;
export const FormItem = styled(ModalFormItem)`
  margin-top: 0px;
`;

export const StyledRadioGroup = styled(RadioGroup)`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  .ant-radio-button-wrapper {
    background-color: transparent;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid ${({ theme }) => theme.palette.secondary2};
    span i {
      display: none;
    }
  }
  .ant-radio-button-wrapper:not(:first-child)::before {
    background-color: transparent;
  }
`;

export const Addresses = styled.div`
  display: flex;
`;
export const Balance = styled.div``;
export const TokenBalance = styled.div``;

export const StyledTable = styled(Table)`
  .ant-table-thead > tr > th.ant-table-selection-column,
  .ant-table-tbody > tr > td.ant-table-selection-column {
    width: 30px !important;
    min-width: 15px !important;
  }
  thead {
    tr th {
      color: ${({ theme }) => theme.palette.light};
      font-size: 13px;
      font-weight: 500;
      line-height: 15px;
    }
  }
  tbody {
    tr {
      td.ant-table-selection-column {
        padding: 4px 0px !important;
      }
    }
    tr:hover {
      background-color: ${({ theme }) => theme.palette.secondary6} !important;
    }
  }
  th,
  td {
    padding: 6px 0px !important;
    span .ant-radio-wrapper-checked {
      span span::after {
        background-color: ${({ theme }) => theme.palette.info} !important;
        border: 1px solid ${({ theme }) => theme.palette.info} !important;
      }
    }
    border: 0px !important;
    font-weight: 500;
    background: none !important;
    span label {
      .ant-radio-inner {
        background-color: transparent;
        border: 1px solid ${({ theme }) => theme.palette.secondary2};
      }
    }
  }
  th {
    font-size: 12px;
    line-height: 14px;
  }
  td {
    font-size: 12px;
    font-weight: 500;
    line-height: 14px;
    color: ${({ theme }) => theme.palette.secondary1} !important;
  }
  .ant-table-small {
    border: none;
  }
  margin-top: 5px;
  margin-left: -15px;
}
`;

export const PreviousAddresses = styled(Button)`
  color: ${({ theme }) => theme.palette.info};
  max-height: 26px;
  min-width: 157px;
  margin-top: 8px;
`;

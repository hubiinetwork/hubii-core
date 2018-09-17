import { Icon, Radio, Table } from 'antd';
import styled from 'styled-components';
import { ModalFormItem } from '../../ui/Modal';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
export const Address = styled.span`
  margin-left: -1.57rem;
`;

export const Flex = styled.div`
  display: flex;
  color: ${({ theme }) => theme.palette.light};
`;

export const SpanText = styled.span`
  font-size: 1.14rem;
  font-weight: 400;
  line-height: 1.36rem;
`;

export const PathTitle = styled.div`
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.14rem;
  color: ${({ theme }) => theme.palette.secondary1};
`;

export const PathSubtitle = styled.div`
  font-size: 0.86rem;
  font-weight: 400;
  line-height: 1rem;
  color: ${({ theme }) => theme.palette.secondary6};
`;

export const PathWrapper = styled.div`
  margin-top: -0.36rem;
  margin-left: 0.5rem;
  width: 10.64rem;
  color: ${({ theme }) => theme.palette.secondary6};
`;

export const Radios = styled.div`
  margin-left: 0.09rem;
`;

export const RadioTitle = styled.div`
  color: ${({ theme }) => theme.palette.light};
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.14rem;
  margin-top: 1.64rem;
`;

export const RadioButtonWrapper = styled.div`
  display: flex;
  margin-top: 1.86rem;
  min-width: 17.14rem;
  .ant-radio-button-wrapper-checked {
    background-color: ${({ theme }) => theme.palette.info} !important;
    border: 0rem;
    span i {
      display: flex !important;
    }
  }
`;

export const Tick = styled(Icon)`
  color: white;
  font-size: 0.79rem;
  font-weight: 700;
`;

export const StyledRadio = styled(RadioButton)``;
export const FormItem = styled(ModalFormItem)`
  margin-top: 0rem;
`;

export const StyledRadioGroup = styled(RadioGroup)`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  .ant-radio-button-wrapper {
    background-color: transparent;
    border-radius: 50%;
    width: 1.14rem;
    height: 1.14rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 0.07rem solid ${({ theme }) => theme.palette.secondary2};
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

export const TokenBalance = styled.div``;

export const StyledTable = styled(Table)`
  .ant-table-thead > tr > th.ant-table-selection-column,
  .ant-table-tbody > tr > td.ant-table-selection-column {
    width: 2.14rem !important;
    min-width: 1.07rem !important;
  }
  thead {
    tr th {
      color: ${({ theme }) => theme.palette.light};
      font-size: 0.93rem;
      font-weight: 400;
      line-height: 1.07rem;
    }
  }
  tbody {
    tr {
      td.ant-table-selection-column {
        padding: 0.29rem 0rem !important;
      }
    }
    tr:hover {
      cursor: pointer;
      background-color: ${({ theme }) => theme.palette.secondary6} !important;
    }
  }
  th,
  td {
    padding: 0.43rem 0.43rem !important;
    span .ant-radio-wrapper-checked {
      span span::after {
        background-color: ${({ theme }) => theme.palette.info} !important;
        border: 0.07rem solid ${({ theme }) => theme.palette.info} !important;
      }
    }
    border: 0rem !important;
    font-weight: 400;
    background: none !important;
    span label {
      .ant-radio-inner {
        background-color: transparent;
        border: 0.07rem solid ${({ theme }) => theme.palette.secondary2};
      }
    }
  }
  th {
    font-size: 0.86rem;
    line-height: 1rem;
  }
  td {
    font-size: 0.86rem;
    font-weight: 400;
    line-height: 1rem;
    color: ${({ theme }) => theme.palette.secondary1} !important;
  }
  .ant-table-small {
    border: none;
  }
  margin-top: 0.36rem;
  margin-left: -1.07rem;
}
`;

export const FormDiv = styled.div`
  margin-left: 2.14rem;
`;

export const StyledSpan = styled.span`
  font-size: 0.86rem;
  font-weight: 400;
  line-height: 1rem;
  text-align: center;
`;

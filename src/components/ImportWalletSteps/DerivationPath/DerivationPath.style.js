import { Icon, Radio, Table } from 'antd';
import styled from 'styled-components';

import Heading from 'components/ui/Heading';
import Text from 'components/ui/Text';
import { ModalFormItem } from 'components/ui/Modal';

const RadioGroup = Radio.Group;
export const RadioButton = Radio.Button;

export const DerivationPathText = styled(Text)`
  color: ${({ theme }) => theme.palette.light};
`;

export const CustomPathWrapper = styled.div`
  display: flex;
  align-items: baseline;
`;

export const PathWrapper = styled.div`
  margin-top: -0.25rem;
  margin-left: 0.5rem;
  color: ${({ theme }) => theme.palette.secondary6};
`;

export const StyledHeading = styled(Heading)`
&& {
  margin-top: 2rem;
}`;

export const RadioButtonWrapper = styled.div`
&&&& {
  display: flex;
  margin-top: 1rem;
  min-width: 17.14rem;
  .ant-radio-button-wrapper-checked {
    background-color: ${({ theme }) => theme.palette.info};
    border: 0rem;
    span i {
      display: flex;
    }
  }
}`;

export const Tick = styled(Icon)`
  color: ${({ theme }) => theme.palette.primary};
  font-size: 0.79rem;
  font-weight: 700;
`;

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

export const StyledTable = styled(Table)`
&&&&& {
  .ant-table-thead > tr > th.ant-table-selection-column,
  .ant-table-tbody > tr > td.ant-table-selection-column {
    width: 2.14rem;
    min-width: 1.07rem;
  }
  thead > tr > th > span {
    color: ${({ theme }) => theme.palette.light};
    font-size: 1.15rem;
    line-height: 1.07rem;
  }
  tbody {
    tr {
      td.ant-table-selection-column {
        padding: 0.29rem 0rem;
      }
    }
    tr:hover {
      cursor: pointer;
      background-color: ${({ theme }) => theme.palette.secondary6};
    }
  }
  th,
  td {
    padding: 0.43rem 0.43rem;
    span .ant-radio-wrapper-checked {
      span span::after {
        background-color: ${({ theme }) => theme.palette.info};
        border: 0.07rem solid ${({ theme }) => theme.palette.info};
      }
    }
    line-height: 1rem;
    border: 0rem;
    background: none;
    span label {
      .ant-radio-inner {
        background-color: transparent;
        border: 0.07rem solid ${({ theme }) => theme.palette.secondary2};
      }
    }
  }
  td {
    color: ${({ theme }) => theme.palette.secondary1};
  }
  .ant-table-small {
    border: none;
  }
  margin-top: 1rem;
  margin-left: -1rem;
}
`;

export const FormDiv = styled.div`
  margin: 0 2.14rem;
`;

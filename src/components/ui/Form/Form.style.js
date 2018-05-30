import { Form } from 'antd';
import styled from 'styled-components';

const FlexForm = styled(Form)`
  flex: 1;
`;

export const FormItem = styled(Form.Item)`
  flex: 1;
  margin-bottom: 30px !important;
  .ant-form-item-label {
    line-height: 12px;
    margin-bottom: 9px;
  }
  .ant-form-item-control-wrapper .ant-form-explain {
    margin-top: 5px;
  }

  .ant-form-item-children {
    display: flex;
  }
`;

export const FormItemLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.palette.secondary1};
  margin-bottom: 8px;
`;

export { FlexForm as Form };

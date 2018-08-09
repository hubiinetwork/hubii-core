import { Form } from 'antd';
import styled from 'styled-components';

const FlexForm = styled(Form)`
  flex: 1;
`;

export const FormItem = styled(Form.Item)`
  flex: 1;
  margin-bottom: 2.14rem !important;
  .ant-form-item-label {
    line-height: 0.86rem;
    margin-bottom: 0.64rem;
  }
  .ant-form-item-control-wrapper .ant-form-explain {
    margin-top: 0.36rem;
  }

  .ant-form-item-children {
    display: flex;
  }
`;

export const FormItemLabel = styled.span`
  font-size: 0.86rem;
  color: ${({ theme }) => theme.palette.secondary1};
  margin-bottom: 0.57rem;
`;

export { FlexForm as Form };

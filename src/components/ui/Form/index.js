import { Form } from 'antd';
import styled from 'styled-components';

import Text from 'components/ui/Text';

const FlexForm = styled(Form)`
  flex: 1;
`;

export const FormItem = styled(Form.Item)`
  flex: 1;
  margin-bottom: 2.14rem !important;
  .ant-form-item-label {
    margin-bottom: 0.1rem;
  }
  .ant-form-item-control-wrapper .ant-form-explain {
    margin-top: 0.36rem;
  }

  .ant-form-item-children {
    display: flex;
  }
`;

export const FormItemLabel = styled(Text)`
  color: ${({ theme }) => theme.palette.secondary1};
  margin-bottom: 0.57rem;
`;

export { FlexForm as Form };

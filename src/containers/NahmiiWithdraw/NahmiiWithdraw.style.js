import styled from 'styled-components';
import { Alert } from 'antd';
import { media } from 'utils/style-utils';
import { Form, FormItem } from 'components/ui/Form';
import Input from 'components/ui/Input';
import Button from 'components/ui/Button';

export const OuterWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  flex-direction: column;
  margin-bottom: 2rem;
`;

export const StyledButton = styled(Button)`
  margin-top: 0.5rem;
`;

export const Image = styled.img`
  width: 2.35rem;
  height: 2.35rem;
  border-bottom: 0.07rem solid ${({ theme }) => theme.palette.secondary};
  padding-bottom: 0.29rem;
`;

export const SettlementWarning = styled(Alert)`
  margin-bottom: 3rem;
  border: none;
  background-color: transparent;
  color: #C0CDD3;
  .ant-alert-message {
    color: #C0CDD3;
  }
`;

export const StyledFormItem = styled(FormItem)`
  .ant-form-item-children {
    align-items: baseline;
  }
`;

export const StyledInput = styled(Input)`
  width: 200px;
  margin-right: 20px;
`;

export const StyledForm = styled(Form)`
  margin: 0 auto;
  width: 500px
`;

export const TransactionsWrapper = styled.div`
  max-width: 60rem;
  min-width: 45rem;
  ${media.tablet`
    max-width: 100rem;
  `}
  flex: 1;
`;

export const TransactionWrapper = styled.div`
  margin-bottom: 0.5rem;
`;

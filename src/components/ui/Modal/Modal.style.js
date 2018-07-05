import { Form, Input, Modal } from 'antd';
import styled from 'styled-components';

export default styled(Modal)`
  .ant-modal-content {
    border-radius: 8px;
    background-color: ${({ theme }) => theme.palette.primary3};
    color: ${({ theme }) => theme.palette.light};
  }
  .ant-modal-close-x {
    color: ${({ theme }) => theme.palette.info};
    font-size: 24px;
    &:hover {
      opacity: 0.7;
    }
  }
`;

export const ModalFormLabel = styled.span`
  color: ${({ theme }) => theme.palette.light};
  margin-bottom: 8px;
  font-family: 'SF Text';
`;

export const ModalFormInput = styled(Input)`
  font-size: 1em;
  font-family: 'SF Text';
  background-color: transparent;
  color: ${({ theme }) => theme.palette.info};
  margin-bottom: 8px;
  border: 1px solid ${({ theme }) => theme.palette.secondary4};
  &:hover {
    border: 1px solid ${({ theme }) => theme.palette.secondary4};
    box-shadow: none;
  }
  &:focus {
    border: 1px solid ${({ theme }) => theme.palette.secondary4};
    box-shadow: none;
    color: ${({ theme }) => theme.palette.info};
  }
`;

export const ModalFormTextArea = styled(Input.TextArea)`
  font-size: 1em;
  font-family: 'SF Text';
  background-color: transparent;
  color: ${({ theme }) => theme.palette.secondary};
  margin-bottom: 8px;
  border: 1px solid ${({ theme }) => theme.palette.secondary};
  &:hover {
    border: 1px solid ${({ theme }) => theme.palette.secondary1};
    box-shadow: none;
  }
  &:focus {
    border: 1px solid ${({ theme }) => theme.palette.secondary1};
    box-shadow: none;
    color: ${({ theme }) => theme.palette.info};
  }
`;

export const ModalFormItem = styled(Form.Item)`
  margin-top: 15px;
  margin-bottom: 0px;
  .ant-form-item-label {
    line-height: 15px;
  }
  .ant-form-item-required:before {
    display: none;
  }
`;

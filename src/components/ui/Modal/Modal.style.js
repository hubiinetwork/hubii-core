import { Form, Input, Modal } from 'antd';
import styled from 'styled-components';

export default styled(Modal)`
  .ant-modal-header {
    background: transparent;
  }
  .ant-modal-title {
    color: ${({ theme }) => theme.palette.light};
  }
  .ant-modal-content {
    padding-top: 0.36rem;
    border-radius: 0.57rem;
    background-color: ${({ theme }) => theme.palette.primary3};
    color: ${({ theme }) => theme.palette.light};
  }
  .ant-modal-close-x {
    padding-top: 0.36rem;
    color: ${({ theme }) => theme.palette.info};
    font-size: 1.71rem;
    &:hover {
      opacity: 0.7;
    }
  }
`;

export const ModalFormLabel = styled.span`
  color: ${({ theme }) => theme.palette.light};
  margin-bottom: 0.57rem;
`;

export const ModalFormInput = styled(Input)`
  /* font-size: 1rem; */
  background-color: transparent;
  color: ${({ theme }) => theme.palette.info};
  margin-bottom: 0.57rem;
  border: 0.07rem solid ${({ theme }) => theme.palette.secondary4};
  &:hover {
    border: 0.07rem solid ${({ theme }) => theme.palette.secondary4};
    box-shadow: none;
  }
  &:focus {
    border: 0.07rem solid ${({ theme }) => theme.palette.secondary4};
    box-shadow: none;
    color: ${({ theme }) => theme.palette.info};
  }
`;

export const ModalFormTextArea = styled(Input.TextArea)`
  /* font-size: 1em; */
  background-color: transparent;
  color: ${({ theme }) => theme.palette.secondary};
  margin-bottom: 0.57rem;
  border: 0.07rem solid ${({ theme }) => theme.palette.secondary};
  &:hover {
    border: 0.07rem solid ${({ theme }) => theme.palette.secondary1};
    box-shadow: none;
  }
  &:focus {
    border: 0.07rem solid ${({ theme }) => theme.palette.secondary1};
    box-shadow: none;
    color: ${({ theme }) => theme.palette.info};
  }
`;

export const ModalFormItem = styled(Form.Item)`
  margin-top: 1.07rem;
  margin-bottom: 0rem;
  .ant-form-item-label {
    line-height: 1.07rem;
  }
  .ant-form-item-required:before {
    display: none;
  }
`;

import styled from 'styled-components';
import { Spin } from 'antd';
import Button from 'components/ui/Button';
import { ModalFormLabel, ModalFormInput, ModalFormItem } from '../ui/Modal';

/**
 * General styling for ImportWalletForms
 */
export const StyledSpin = styled(Spin)`
  &.ant-spin.ant-spin-show-text .ant-spin-text{
    margin-top:1.5rem;
  }
  color: white;
`;

export const WidthEighty = styled.div`
  width: 70%;
`;

export const StyledModalFormLabel = styled(ModalFormLabel)`
  height: 1rem;
  font-size: 0.86rem;
  font-weight: 400;
  line-height: 1rem;
`;

export const ButtonDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.loading ? '1.79rem' : '3.57rem'};
  margin-bottom: 1.86rem;
`;

export const StyledButton = styled(Button)`
  background-color: ${({ disabled: white }) =>
    white && 'transparent !important'};
  font-size: 0.86rem;
  font-weight: 400;
  border-width: 0.14rem;
  height: 2.86rem;
  width: 11.57rem;
  border: ${({ disabled: white, theme }) =>
    white && `0.14rem solid ${theme.palette.secondary4} !important`};
  min-width: ${({ current: width }) => (width === 0 ? '18.57rem' : '13.57rem')};
  color: ${({ disabled: white, theme }) =>
    white
      ? `${theme.palette.secondary4} !important`
      : `${theme.palette.light} !important`};
  &:hover {
    background-color: ${({ disabled: white }) =>
      white && 'transparent !important'};
    border: ${({ disabled: white, theme }) =>
      white && `0.14rem solid ${theme.palette.secondary4} !important`};
  }
`;

export const StyledBackButton = styled(Button)`
  height: 2.86rem;
  width: 5rem;
  margin-right: 0.57rem;
  border-radius: 0.29rem;
  border: 0.07rem solid ${({ theme }) => theme.palette.light};
`;

export const StyledSpan = styled.span`
  font-size: 0.86rem;
  font-weight: 400;
  line-height: 1rem;
  text-align: center;
`;

/**
 * Specific styling for ImportWalletNameForm
 */
export const FormInput = styled(ModalFormInput)`
  height: 3.29rem;
  width: 29.29rem;
  border: 0.07rem solid #43616F;
  border-radius: 0.29rem;
`;

export const FormItem = styled(ModalFormItem)`
  display: flex;
  flex-direction: column;
  align-items: center;
  .ant-form-item-label{
    display: flex;
    align-self: start;
    margin-left: -0.93rem;
  }
`;

export const IconDiv = styled.div`
  display: flex;
  justify-content: center;
`;

export const Image = styled.img`
width: 10.71rem;
height: 3.14rem;
margin-top: 1rem;
margin-bottom: 1rem;
`;


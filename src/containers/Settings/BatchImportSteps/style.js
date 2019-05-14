import styled from 'styled-components';
import { Spin, Icon } from 'antd';
import Button from 'components/ui/Button';
import { ModalFormInput, ModalFormItem } from 'components/ui/Modal';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export const LeftArrow = styled(Icon)`
  font-size: 1.5rem;
  margin-right: 0.5rem;
  cursor: pointer;
`;

export const NavigationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: auto;
`;

export const StyledSpin = styled(Spin)`
  &.ant-spin.ant-spin-show-text .ant-spin-text{
    margin-top:1.5rem;
  }
  color: white;
`;

export const WidthEighty = styled.div`
  width: 70%;
`;

export const FinalHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    max-width: 14rem;
    max-height: 5rem;
    margin-bottom: 1rem;
  }
`;

export const ButtonDiv = styled.div`
  display: flex;
  justify-content: center;
  margin: 1.8rem 0;
`;

export const StyledButton = styled(Button)`
  width: 11.57rem;
`;

export const StyledBackButton = styled(Button)`
  width: 5rem;
  margin-right: 1.57rem;
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


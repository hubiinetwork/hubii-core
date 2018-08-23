import styled from 'styled-components';
import Button from '../ui/Button';
import { ModalFormLabel, ModalFormInput } from '../ui/Modal';

export const Wrapper = styled.div`
  .ant-form-item-required:before {
    display: none;
  }
  .ant-form-vertical {
    display: flex;
    flex-direction: column;
  }
  .ant-form-vertical .ant-form-item {
    padding-bottom: 0rem;
  }
  .ant-form-item {
    margin-bottom: 0rem;
  }
`;

export const ConversionWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  border-bottom: 0.07rem solid ${({ theme }) => theme.palette.secondary5};
  margin-bottom: 3rem;
  margin-top: 1rem;
`;

export const Conversion = styled.div`
  border: 0.07rem solid ${({ theme }) => theme.palette.secondary5};
  border-radius: 2.14rem;
  padding-top: 0.29rem;
  padding-bottom: 0.29rem;
  background-color: ${({ theme }) => theme.palette.primary1};
  min-width: 15.71rem;
  color: ${({ theme }) => theme.palette.secondary6};
  text-align: center;
  font-size: 0.86rem;
  font-weight: 400;
  line-height: 1.43rem;
  margin-bottom: -0.86rem;
`;

export const StyledButton = styled(Button)`
  color: ${({ theme }) => theme.palette.light};
  margin-top: 2.14rem;
  min-width: 21.43rem;
  margin-bottom: 2.14rem;
  border: 0.14rem solid ${({ theme }) => theme.palette.info3};
`;
export const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;
export const HeadingDiv = styled.div`
  color: ${({ theme }) => theme.palette.light};
  display: flex;
  font-size: 1.14rem;
  font-weight: 400;
  line-height: 1.36rem;
  justify-content: center;
`;
export const StyledLabel = styled(ModalFormLabel)`
  color: ${({ theme }) => theme.palette.secondary};
  font-size: 0.86rem;
  font-weight: 400;
  line-height: 1rem;
`;
export const StyledInput = styled(ModalFormInput)`
  color: ${({ theme }) => theme.palette.light};
  border: none;
  border-radius: unset;
  font-size: 1.57rem;
  margin-bottom: 0rem;
  padding: 0rem !important;
  border-bottom: 0.07rem solid ${({ theme }) => theme.palette.secondary1};
  &:hover,
  &:focus,
  &:active {
    border: none;
    border-radius: unset;
    border-bottom: 0.07rem solid ${({ theme }) => theme.palette.secondary1};
  }
  &:focus {
    color: ${({ theme }) => theme.palette.light};
  }
`;
export const StyledSpan = styled.div`
  color: ${({ theme }) => theme.palette.secondary1};
  position: absolute;
  right: 0;
  bottom: 0;
`;
export const ItemDiv = styled.div`
  margin-bottom: 2.86rem;
  display: flex;
  .has-error .ant-input:focus {
    box-shadow: none;
  }
`;
export const Buttons = styled.div`
  display: flex;
  align-items: center;
`;
export const BalanceDiv = styled.div`
  margin-top: 2rem;
  margin-bottom: 1.5rem;
`;
export const CancelButton = styled(Button)`
  background-color: transparent;
  color: ${({ theme }) => theme.palette.light};
  min-width: 9.29rem;
  margin-right: 1.14rem;
  border-radius: 0.29rem;
`;

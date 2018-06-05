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
    padding-bottom: 0px;
  }
  .ant-form-item {
    margin-bottom: 0px;
  }
`;

export const ConversionWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  border-bottom: 1px solid ${({ theme }) => theme.palette.secondary5};
  margin-bottom: 3rem;
  margin-top: 1rem;
`;

export const Conversion = styled.div`
  border: 1px solid ${({ theme }) => theme.palette.secondary5};
  border-radius: 30px;
  padding-top: 4px;
  padding-bottom: 4px;
  background-color: ${({ theme }) => theme.palette.primary1};
  min-width: 220px;
  color: ${({ theme }) => theme.palette.secondary6};
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  margin-bottom: -12px;
`;

export const StyledButton = styled(Button)`
  color: ${({ theme }) => theme.palette.light};
  margin-top: 30px;
  min-width: 300px;
  margin-bottom: 30px;
  border: 2px solid ${({ theme }) => theme.palette.info3};
`;
export const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;
export const HeadingDiv = styled.div`
  color: ${({ theme }) => theme.palette.light};
  display: flex;
  font-size: 16px;
  font-weight: 500;
  line-height: 19px;
  justify-content: center;
`;
export const StyledLabel = styled(ModalFormLabel)`
  color: ${({ theme }) => theme.palette.secondary};
  font-size: 12px;
  font-weight: 500;
  line-height: 14px;
`;
export const StyledInput = styled(ModalFormInput)`
  color: ${({ theme }) => theme.palette.light};
  border: none;
  border-radius: unset;
  font-size: 22px;
  margin-bottom: 0px;
  padding: 0px !important;
  border-bottom: 1px solid ${({ theme }) => theme.palette.secondary1};
  &:hover,
  &:focus,
  &:active {
    border: none;
    border-radius: unset;
    border-bottom: 1px solid ${({ theme }) => theme.palette.secondary1};
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
  margin-bottom: 40px;
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
  min-width: 130px;
  margin-right: 16px;
  border-radius: 4px;
`;

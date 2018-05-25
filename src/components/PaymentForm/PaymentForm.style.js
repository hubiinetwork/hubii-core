import styled from 'styled-components';
import Button from '../ui/Button';
import { ModalFormLabel, ModalFormInput } from '../ui/Modal';

export const Wrapper = styled.div`
  .ant-form-item-required:before {
    display: none;
  }
  .ant-form-vertical {
    display: flex;
    max-width: 67%;
    margin-left: 113px;
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
  margin-top: -13px;
  justify-content: center;
`;

export const Conversion = styled.div`
  border: 1px solid ${({ theme }) => theme.palette.secondary1};
  border-radius: 30px;
  padding-top: 4px;
  padding-bottom: 4px;
  background-color: ${({ theme }) => theme.palette.primary1};
  min-width: 220px;
  color: ${({ theme }) => theme.palette.secondary1};
  text-align: center;
  font-size: 11px;
`;

export const StyledButton = styled(Button)`
  color: ${({ theme }) => theme.palette.light};
  margin-top: 30px;
  min-width: 300px;
  margin-bottom: 30px;
`;
export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;
export const HeadingDiv = styled.div`
  color: ${({ theme }) => theme.palette.light};
  display: flex;
  font-size: 20px;
  justify-content: center;
`;
export const TermDiv = styled.div`
  color: ${({ theme }) => theme.palette.secondary1};
  display: flex;
  justify-content: center;
`;
export const StyledLabel = styled(ModalFormLabel)`
  color: ${({ theme }) => theme.palette.secondary1};
  font-size: 15px;
`;
export const StyledInput = styled(ModalFormInput)`
  color: ${({ theme }) => theme.palette.light};
  border: none;
  border-radius: unset;
  font-size: 22px;
  width: 90% !important;
  padding: 0px !important;
  border-bottom: 1px solid ${({ theme }) => theme.palette.secondary1};
  &:hover {
    border: none;
    border-radius: unset;
    border-bottom: 1px solid ${({ theme }) => theme.palette.secondary1};
  }
  &:focus {
    color: ${({ theme }) => theme.palette.light};
    border: none;
    border-radius: unset;
    border-bottom: 1px solid ${({ theme }) => theme.palette.secondary1};
  }
  &:active {
    border: none;
    border-radius: unset;
    border-bottom: 1px solid ${({ theme }) => theme.palette.secondary1};
  }
`;
export const StyledSpan = styled.span`
  color: ${({ theme }) => theme.palette.secondary1};
  padding-bottom: 5px;
  border-bottom: 1px solid ${({ theme }) => theme.palette.secondary1};
`;
export const ItemDiv = styled.div`
  margin-bottom: 40px;
`;
export const StyledA = styled.a`
  color: ${({ theme }) => theme.palette.light};
  padding-left: 5px;
  text-decoration: underline;
  &:hover {
    color: ${({ theme }) => theme.palette.light};
    padding-left: 5px;
    text-decoration: underline;
  }
`;
export const BalanceDiv = styled.div`
  margin-top: 30px;
  margin-left: 110px;
  margin-bottom: 20px;
`;

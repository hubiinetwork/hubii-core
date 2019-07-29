import styled from 'styled-components';
import Button from 'components/ui/Button';
import { Checkbox } from 'antd';

export const StyledButton = styled(Button)`
  margin-top: 2rem;
  width: 11.57rem;
  margin-right: 2rem;
`;

export const StyledCheckBox = styled(Checkbox)`
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: ${({ theme }) => theme.palette.info2};
    border-color: ${({ theme }) => theme.palette.info2};
  }
`;

export const Wrapper = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
`;

export const TermsLink = styled.a`
&&&& {
  color: ${({ theme }) => theme.palette.secondary};
  word-break: break-all;
  ${({ disabled, theme }) => !disabled && `
    text-decoration: underline;
    &:hover {
      color: ${theme.palette.info};
    }
  `}
}`;

export const AgreementText = styled.span`
&&&& {
  color: ${({ theme }) => theme.palette.secondary};
  word-break: break-all;
}`;

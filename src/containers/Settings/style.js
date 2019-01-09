import styled from 'styled-components';
import SectionHeading from 'components/ui/SectionHeading';
import { Switch, Checkbox } from 'antd';

export const Wrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.palette.primary1};
`;

export const Body = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export const StyledSwitch = styled(Switch)`
  border-width: 0.125rem;
  margin-left: auto;
  margin-right: 0.5rem;
  width: 1rem;
  min-width: 2.9rem;
  background-color: ${({ theme }) => theme.palette.secondary2};
  &.ant-switch:after, &.ant-switch-checked:after {
    background-color: ${({ theme }) => theme.palette.info3};
  }
`;

export const SettingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-top: 2rem;
`;

export const StyledSectionHeading = styled(SectionHeading)`
  margin-bottom: 0.5rem;
`;

export const NahmiiInfoCheckbox = styled(Checkbox)`
&&&& {
  & > span {
    display: flex;
  }
  width: 20rem;
  display: flex;
  align-items: flex-end;
}
`;

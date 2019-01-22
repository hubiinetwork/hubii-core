import styled from 'styled-components';
import { Switch } from 'antd';

import Button from 'components/ui/Button';
import Text from 'components/ui/Text';

export const TransferDescriptionWrapper = styled.div`
  min-width: 34rem;
  margin-bottom: 3rem;
`;

export const TransferFormWrapper = styled.div`
  display: flex;
  margin-right: 2rem;
  margin-bottom: 3rem;
  flex: 1;
`;

export const OuterWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  margin-top: 0.5rem;
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

export const ETHtoDollar = styled(Text)`
  color: ${({ theme }) => theme.palette.secondary};
`;

export const AdvanceSettingsHeader = styled(Text)`
  color: ${({ theme }) => theme.palette.info};
`;

export const NahmiiSwitch = styled(Switch)`
  &&& {
    ${({ checked, theme }) => checked ? `background-color: ${theme.palette.info3};` : null}
  }
`;

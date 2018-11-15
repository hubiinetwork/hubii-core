import styled from 'styled-components';
import { Spin } from 'antd';

import Button from 'components/ui/Button';
import Text from 'components/ui/Text';

export const WrapperDiv = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
`;

export const FinishButton = styled(Button)`
  min-width: 17.14rem;
  margin-top: 3rem;
`;

export const CenterWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 0.71rem;
  margin-bottom: 0.86rem;
  align-items: center;
`;

export const WarningList = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
`;

export const WarningPoint = styled.li`
  line-height: 1.3rem;
  color: yellow;
  margin-bottom: 0.5rem;
`;

export const SeedText = styled(Text)`
  color: ${({ theme }) => theme.palette.info};
  flex: 1;
`;

export const StyledSpin = styled(Spin)`
  margin-top: 2rem;
  &.ant-spin.ant-spin-show-text .ant-spin-text{
    margin-top:1.5rem;
  }
  color: white;
`;

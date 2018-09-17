import styled from 'styled-components';
import { Icon, Spin } from 'antd';
import Button from 'components/ui/Button';

export const InfoContent = styled.span`
  color: ${({ theme }) => theme.palette.secondary1};
  font-size: 0.93rem;
`;

export const WrapperDiv = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
`;

export const Info = styled(Icon)`
  color: ${({ theme }) => theme.palette.secondary4};
  font-size: 0.93rem;
  display: flex;
  align-items: center;
  &:hover {
    color: ${({ theme }) => theme.palette.info};
  }
`;

export const RoundButton = styled(Button)`
  width: 2.07rem !important;
  height: 2.07rem !important;
`;

export const FinishButton = styled(Button)`
  min-width: 17.14rem;
  border-width: 0.14rem;
  margin-top: 3rem;
`;

export const Arrow = styled(Icon)`
  margin-right: 0.43rem;
  display: flex;
  align-items: center;
  font-weight: 700;
`;

export const IconWrapper = styled.div`
  display: flex;
  margin-top: -0.5rem;
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
  color: ${({ theme }) => theme.palette.light};
  line-height: 1.3rem;
  font-size: 0.9rem;
  font-weight: 400;
  color: yellow;
  margin-bottom: 0.5rem;
`;

export const SeedText = styled.span`
  color: ${({ theme }) => theme.palette.info};
  font-size: 1.3rem;
  line-height: 1.2;
  flex: 0.869;
`;

export const StyledSpin = styled(Spin)`
  margin-top: 2rem;
  &.ant-spin.ant-spin-show-text .ant-spin-text{
    margin-top:1.5rem;
  }
  color: white;
`;

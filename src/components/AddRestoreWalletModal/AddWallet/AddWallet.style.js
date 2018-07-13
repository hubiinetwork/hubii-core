import styled from 'styled-components';
import { Icon, Spin } from 'antd';
import Button from '../../ui/Button';

export const InfoContent = styled.span`
  color: ${({ theme }) => theme.palette.secondary1};
  font-size: 13px;
  font-family: 'SF Text';
`;

export const WrapperDiv = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
`;

export const HBT = styled.img`
  width: 38.4px;
  height: 38.4px;
`;

export const HBTtext = styled.div`
  color: ${({ theme }) => theme.palette.light};
  font-size: 22.8px;
  font-style: italic;
  font-weight: 900;
  line-height: 27px;
  margin-left: 8px;
`;

export const Info = styled(Icon)`
  color: ${({ theme }) => theme.palette.secondary4};
  font-size: 13px;
  display: flex;
  align-items: center;
  &:hover {
    color: ${({ theme }) => theme.palette.info};
  }
`;

export const RoundButton = styled(Button)`
  color: ${({ theme }) => theme.palette.secondary1};
  background: ${({ theme }) => theme.palette.secondary4};
  border-color: ${({ theme }) => theme.palette.primary4};
  width: 29px !important;
  height: 29px !important;
  &:hover {
    color: ${({ theme }) => theme.palette.info} !important;
    background: ${({ theme }) => theme.palette.secondary4} !important;
    border-color: ${({ theme }) => theme.palette.secondary4} !important;
  }
  &:focus {
    color: ${({ theme }) => theme.palette.secondary1};
    background: ${({ theme }) => theme.palette.secondary4};
    border-color: ${({ theme }) => theme.palette.secondary4};
  }
`;

export const FinishButton = styled(Button)`
  min-width: 240px;
  border-width: 2px;
  margin-top: 3rem;
  font-family: 'SF Text';
`;

export const Arrow = styled(Icon)`
  margin-right: 6px;
  display: flex;
  align-items: center;
  font-weight: 700;
`;

export const IconWrapper = styled.div`
  display: flex;
  margin-top: -7px;
`;

export const CenterWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 12px;
  align-items: center;
`;

export const SeedWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;
`;

export const SeedInfo = styled.span`
  color: ${({ theme }) => theme.palette.light};
  font-size: 12px;
  font-weight: 500;
  font-family: 'SF Text';
`;

export const SeedText = styled.span`
  color: ${({ theme }) => theme.palette.info};
  font-size: 16px;
  line-height: 1.2;
  flex: 0.869;
  font-family: 'SF Text';
`;

export const StyledSpin = styled(Spin)`
  margin-top: 2rem;
  &.ant-spin.ant-spin-show-text .ant-spin-text{
    margin-top:1.5rem;
  }
  color: white;
`;

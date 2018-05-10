import styled from 'styled-components';
import { Icon } from 'antd';
import Button from '../../ui/Button';

export const InfoContent = styled.span`
  color: ${({ theme }) => theme.palette.secondary1};
  font-size: 13px;
`;

export const WrapperDiv = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
`;

export const Info = styled(Icon)`
  color: ${({ theme }) => theme.palette.secondary1};
  font-size: 20px;
  display: flex;
  align-items: center;
  &:hover {
    color: ${({ theme }) => theme.palette.info};
  }
`;

export const Loading = styled(Icon)`
  font-size: 75px;
  color: ${({ theme }) => theme.palette.info};
  margin-top: 1rem;
`;

export const RoundButton = styled(Button)`
  color: ${({ theme }) => theme.palette.secondary1};
  background: ${({ theme }) => theme.palette.primary4};
  border-color: ${({ theme }) => theme.palette.primary4};
  &:hover {
    color: ${({ theme }) => theme.palette.info} !important;
    background: ${({ theme }) => theme.palette.primary4} !important;
    border-color: ${({ theme }) => theme.palette.primary4} !important;
  }
  &:focus {
    color: ${({ theme }) => theme.palette.secondary1};
    background: ${({ theme }) => theme.palette.primary4};
    border-color: ${({ theme }) => theme.palette.primary4};
  }
`;

export const FinishButton = styled(Button)`
  min-width: 240px;
  border-width: 2px;
  margin-top: 2rem;
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
`;

export const SeedWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;
`;

export const SeedInfo = styled.span`
  color: ${({ theme }) => theme.palette.light};
  font-size: 12px;
`;

export const SeedText = styled.span`
  color: ${({ theme }) => theme.palette.info};
  font-size: 16px;
  line-height: 1.2;
  flex: 0.8;
`;

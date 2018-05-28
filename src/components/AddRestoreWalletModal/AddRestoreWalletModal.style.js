import styled from 'styled-components';
import Button from '../ui/Button';
import { Icon } from 'antd';

export const TitleDiv = styled.div`
  font-size: 16px;
  margin-top: 66px;
  text-align: center;
  color: ${({ theme }) => theme.palette.light};
  font-weight: 500;
`;

export const DescriptionWrapper = styled.div`
  display: flex;
  color: ${({ theme }) => theme.palette.secondary4};
  align-items: center;
  margin-top: 120px;
  justify-content: center;
`;

export const TextWhite = styled.span`
  color: ${({ theme }) => theme.palette.light};
  height: 14px;
  width: 112.39px;
  font-size: 12px;
  font-weight: 500;
  line-height: 14px;
  text-align: center;
`;

export const TextGrey = styled.span`
  color: ${({ theme }) => theme.palette.secondary6};
  margin-left: 5px;
`;

export const Info = styled(Icon)`
  font-size: 13px;
  margin-top: 4px;
`;
export const Arrow = styled(Icon)`
  margin-right: 6px;
  display: flex;
  align-items: center;
  font-weight: 700;
  cursor: pointer;
`;

export const IconWrapper = styled.div`
  height: 19px;
  font-weight: 500;
  line-height: 19px;

  font-size: 16px;
  display: flex;
  margin-top: -7px;
  color: ${({ theme }) => theme.palette.light};
`;

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 130px;
  color: ${({ theme }) => theme.palette.light};
  margin: auto;
  i {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: ${({ theme }) => theme.palette.info};
  }
`;

export const Description = styled.div`
  color: ${({ theme }) => theme.palette.light1};
  font-size: 12px;
  margin-top: 8px;
  margin-bottom: 48px;
`;

export const ButtonDiv = styled(Button)`
  margin: auto;
  display: block;
  min-width: 250px;
  height: 40px;
  margin-top: 24px;
  margin-bottom: 20px;
  border-width: 1.2px;
  border-color: ${({ theme }) => theme.palette.light} !important;
  span {
    color: ${({ theme }) => theme.palette.light};
  }
  &:hover {
    color: ${({ theme }) => theme.palette.info};
    opacity: 0.9;
    border-color: ${({ theme }) => theme.palette.light} !important;
    background: none !important;
  }
  &:focus {
    color: ${({ theme }) => theme.palette.info};
    opacity: 0.9;
    border-color: ${({ theme }) => theme.palette.light} !important;
    background: transparent !important;
  }
  &:active {
    color: ${({ theme }) => theme.palette.info};
    opacity: 0.9;
    border-color: ${({ theme }) => theme.palette.light} !important;
    background: transparent !important;
  }
`;

export const RightTopButton = styled(Button)`
  min-width: 131px;
  border-color: ${({ theme }) => theme.palette.light};
`;

export const DisabledButton = styled(ButtonDiv)`
  cursor: not-allowed;
`;

import styled from "styled-components";
import Button from "../ui/Button";
import { Icon } from "antd";

export const TitleDiv = styled.div`
  font-size: 17px;
  margin-top: 66px;
  text-align: center;
`;

export const Arrow = styled(Icon)`
  margin-right: 6px;
  display: flex;
  align-items: center;
  font-weight: 700;
  cursor: pointer;
`;

export const IconWrapper = styled.div`
  display: flex;
  margin-top: -7px;
`;

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100px;
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
  color: ${({ theme }) => theme.palette.secondary};
  font-size: 12px;
  margin-top: 8px;
  margin-bottom: 48px;
`;

export const ButtonDiv = styled(Button)`
  margin: auto;
  opacity: 0.6;
  display: block;
  min-width: 45%;
  margin-top: 20px;
  margin-bottom: 20px;
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

export const DisabledButton = styled(ButtonDiv)`
  cursor: not-allowed;
`;

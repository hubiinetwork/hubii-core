import styled from "styled-components";
import { Menu } from "antd";

export const AssetsWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
`;

export const AssetWrapper = styled.div`
  margin-right: 12px;
  margin-top: 6px;
  &:last-child {
    margin-right: 0;
  }
`;

export const CardIcon = styled.div`
  position: absolute;
  color: ${({ theme }) => theme.palette.secondary1};
  font-size: 20px;
  margin-left: 8px;
  &:hover {
    color: ${({ theme }) => theme.palette.info};
    font-size: 20px;
    margin-left: 8px;
  }
  top: 13px;
  right: 28px;
`;

export const CardIconSettings = styled.div`
  position: absolute;
  color: ${({ theme }) => theme.palette.secondary1};
  font-size: 20px;
  margin-left: 8px;
  &:hover {
    color: ${({ theme }) => theme.palette.info};
    font-size: 20px;
    margin-left: 8px;
  }
  bottom: 10px;
  right: 28px;
`;

export const LeftSideWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

export const TotalBalance = styled.span`
  color: ${({ theme }) => theme.palette.info};
  font-size: 18px;
  margin-right: 25px;
`;

export const OuterWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  min-height: 120px;
  padding: 15px 20px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.palette.primary4};
  color: white;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.light};
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.palette.primary2};
  }
`;

export const RightSideTopWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
`;

export const RightSideWrapper = styled.div`
  display: flex;
`;

export const IconMenu = styled(Menu)`
  background-color: ${({ theme }) => theme.palette.primary3};
`;

export const MenuItem = styled(Menu.Item)`
  color: ${({ theme }) => theme.palette.secondary1};
  &:hover {
    color: ${({ theme }) => theme.palette.primary3};
    background-color: ${({ theme }) => theme.palette.info};
  }
`;

export const MenuDivider = styled(Menu.Divider)`
  background-color: ${({ theme }) => theme.palette.secondary1};
`;

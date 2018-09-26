import styled from 'styled-components';
import { Menu, Icon } from 'antd';

import Text from 'components/ui/Text';

export const AssetsWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
`;

export const IconsWrapper = styled.div`
  display: flex;
  height: 0%;
  flex-direction: column;
  justify-content: space-between;
  position: absolute;
  right: 0;
  margin-right: 1.65rem;
  margin-top: 1.29rem;
`;

export const AssetWrapper = styled.div`
  margin-right: 0.86rem;
  margin-top: 0.43rem;
  &:last-child {
    margin-right: 0;
  }
`;

export const CardIcon = styled.div`
  color: ${({ theme }) => theme.palette.secondary1};
  &:hover {
    color: ${({ theme }) => theme.palette.info};
  }
`;

export const OverflowHidden = styled.div`
  overflow: hidden;
  border-radius: 0.71rem;
`;

export const CardIconSettings = styled.div`
  display: flex;
  align-items: flex-end;
  flex: 1;
  color: ${({ theme }) => theme.palette.secondary1};
  &:hover {
    color: ${({ theme }) => theme.palette.info};
  }
`;

export const Spinner = styled(Icon)`
  display: flex;
  margin: auto;
  font-size: 2rem;
`;

export const LeftSideWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

export const TotalBalance = styled(Text)`
  color: ${({ theme }) => theme.palette.info};
  margin-top: -0.25rem;
  margin-right: 2.14rem;
  word-wrap: break-word;
  min-width: 10.71rem;
  text-align: right;
  flex: 1;
`;

export const WalletName = styled(Text)`
  min-width: 5rem;
  word-wrap: break-word;
`;

export const OuterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 8.57rem;
  padding: 1.29rem 1.71rem;
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
  overflow: hidden;
  cursor: pointer;
  padding: 0;
  .ant-dropdown-menu-item:first-child:hover {
    border-radius: 0.29rem 0.29rem 0 0;
  }
  .ant-dropdown-menu-item:last-child:hover {
  border-radius: ${(props) => props.singleitem === 'true' ? '0.29rem 0.29rem' : '0 0'} 0.29rem 0.29rem;
  }

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
  margin: 0;
`;

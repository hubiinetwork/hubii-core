import styled from 'styled-components';
import { Menu, Icon } from 'antd';

import Text from 'components/ui/Text';
import Heading from 'components/ui/Heading';
import Button from 'components/ui/Button';

export const AssetsWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
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

export const Border = styled.div`
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
  position: absolute;
  right: 1.8rem;
  bottom: -1rem;
`;

export const Spinner = styled(Icon)`
  display: flex;
  margin: auto;
  font-size: 2rem;
`;

export const ToggleExpandedArrow = styled(Icon).attrs({
  type: 'down',
  style: ({ expanded }) => ({
    transform: `rotate(${expanded * 180}deg)`,
  }),
})`
  margin-right: 0.5rem;
  margin-left: 0.3rem;
  padding-top: 0.3rem;
  color: ${({ theme }) => theme.palette.secondary1};
`;

export const LeftSideWrapper = styled.div`
  display: flex;
  align-items: baseline;
  flex-direction: row;
  margin-bottom: 0.5rem;
  padding-top: 1.29rem;
  &:hover ${ToggleExpandedArrow} {
    color: ${(props) => props.theme.palette.info};
  }
`;

export const TotalBalance = styled(Heading)`
  color: ${({ theme }) => theme.palette.info};
  margin-top: -0.25rem;
  margin-right: 2.14rem;
  margin-left: auto;
`;

export const WalletName = styled(Text)`
  margin-right: 1rem;
  word-break: break-word;
`;

export const BalanceDetails = styled.div`
`;

export const OuterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0 0 1.29rem 1.71rem;
  background-color: ${({ theme }) => theme.palette.primary4};
  color: white;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.light};
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.palette.primary2};
  }

  > * {
    padding-right: 1.29rem;
  }
`;

export const DynamicOuterWrapper = styled(OuterWrapper)`
  max-height: ${(props) => props.folded ? '4.5rem' : '20rem'};

  &:hover ${ToggleExpandedArrow} {
    color: ${(props) => props.folded ? props.theme.palette.info : 'none'};
  }

  ${BalanceDetails} {
    visibility: ${(props) => props.folded ? 'hidden' : 'visible'};
  }

  ${CardIconSettings} {
    visibility: ${(props) => props.folded ? 'hidden' : 'visible'};
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

export const QuickAddressWrapper = styled.div`
`;

export const QuickAddressText = styled(Text)`
  color: ${({ theme }) => theme.palette.secondary};
  font-size: 0.9rem;
`;

export const QuickAddressIcon = styled(Button).attrs({
  type: 'icon',
  icon: 'copy',
  size: 'small',
})`
  transform: scale(0.85);
  word-break: break-word;
`;


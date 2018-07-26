import styled from 'styled-components';
import { Layout, Switch } from 'antd';
import Toggler from 'components/Toggler';
import Button from '../../components/ui/Button';
const { Header } = Layout;
export const Wrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.palette.primary1};
`;

export const Heading = styled.h2`

  display: flex;
  font-family: "SF Text";
  font-weight: 500;
  margin: 0;
  color: ${({ theme }) => theme.palette.light};
  font-size: 18px;
`;

export const StyledToggler = styled(Toggler)`
  margin-top: 5rem;
`;

export const TabsLayout = styled(Layout)`

  background: ${({ theme }) => theme.palette.primary3};
`;

export const StyledButton = styled(Button)`
  margin-left: auto;
  border-width: 2px;
  padding: 0.5rem 1rem;
`;

export const StyledSwitch = styled(Switch)`
  border-width: 2px;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  width: 43px;
`;

export const WalletsTabHeader = styled(Header)`
  align-items: center;
  display: flex;
  height: 74px;
  padding: 0 28px;
  background: ${({ theme }) => theme.palette.primary4};
`;

//

// export const Wrapper = styled.div`
//   display: flex;
//   justify-content: space-between;
//   max-width: 130px;
//   color: ${({ theme }) => theme.palette.light};
//   margin: auto;
//   i {
//     display: flex;
//     align-items: center;
//     font-size: 14px;
//     color: ${({ theme }) => theme.palette.info};
//   }
// `;

export const TextWhite = styled.span`
  color: ${({ theme }) => theme.palette.light};
  height: 14px;
  width: 112.39px;
  font-size: 12px;
  font-weight: 500;
  line-height: 14px;
  text-align: center;
  font-family: 'SF Text';
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

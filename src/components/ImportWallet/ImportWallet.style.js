import styled from 'styled-components';
import Button from '../ui/Button';
import { Icon, Radio } from 'antd';

export const Between = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CreateButton = styled(Button)`
  background-color: transparent;
  color: ${({ theme }) => theme.palette.light};
  &:hover {
    background-color: ${({ theme }) => theme.palette.info2};
    color: ${({ theme }) => theme.palette.light};
    border-color: ${({ theme }) => theme.palette.light};
  }
`;

export const LeftArrow = styled(Icon)`
  font-size: 20px;
  margin-right: 7px;
  cursor: pointer;
`;

export const Coins = styled(Radio.Group)`
  margin-top: 32px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .ant-radio-button-wrapper-checked {
    background-color: ${({ theme }) => theme.palette.info};
    border: 1px solid ${({ theme }) => theme.palette.info};
  }
`;
const RadioButton = Radio.Button;
export const CoinButton = styled(RadioButton)`
  margin-top: 15px;
  padding-left: 25px;
  padding-right: 25px;
  padding-top: 8px;
  padding-bottom: 40px;
  background-color: transparent;
`;

export const Flex = styled.div`
  display: flex;
  color: ${({ theme }) => theme.palette.light};
`;

import * as React from 'react';
import { Icon, Radio } from 'antd';
import Button from '../ui/Button';
import {
  Between,
  CreateButton,
  LeftArrow,
  Flex,
  Coins
} from './ImportWallet.style';
const onChange = e => {
  console.log(`radio checked:${e.target.value}`);
};
const RadioButton = Radio.Button;
const ImportWallet = () => (
  <div>
    <Between>
      <Flex>
        <LeftArrow type="arrow-left" />
        <span>Importing Ledger Wallet</span>
      </Flex>
      <div>
        <CreateButton>
          <Icon type="plus" />Create new wallet
        </CreateButton>
      </div>
    </Between>
    <Coins onChange={onChange}>
      <RadioButton value="a">Coin1</RadioButton>
      <RadioButton value="b">Coin1</RadioButton>
      <RadioButton value="c">Coin1</RadioButton>
      <RadioButton value="d">Coin1</RadioButton>
      <RadioButton value="e">Coin1</RadioButton>
    </Coins>
  </div>
);
export default ImportWallet;

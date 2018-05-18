import * as React from 'react';
import { Icon } from 'antd';
import {
  Between,
  CreateButton,
  LeftArrow,
  Flex,
  Coins,
  CoinButton,
  Image,
  Center
} from './ImportWallet.style';
const onChange = e => {
  console.log(`radio checked:${e.target.value}`);
};
const ImportWallet = () => (
  <div>
    <Between>
      <Flex>
        <LeftArrow
          type="arrow-left"
          onClick={() => {
            console.log('Go  back to  Import  wallet screen');
          }}
        />
        <span>Importing Ledger Wallet</span>
      </Flex>
      <div>
        <CreateButton>
          <Icon type="plus" />Create new wallet
        </CreateButton>
      </div>
    </Between>
    <Coins onChange={onChange}>
      <CoinButton value="a">
        <Center>
          <Image src="https://www.ledger.fr/wp-content/uploads/2017/09/Ledger_logo_footer@2x.png" />
        </Center>
      </CoinButton>
      <CoinButton value="b">
        <Center>
          <Image src="https://www.ledger.fr/wp-content/uploads/2017/09/Ledger_logo_footer@2x.png" />
        </Center>
      </CoinButton>
      <CoinButton value="c">
        <Center>
          <Image src="https://www.ledger.fr/wp-content/uploads/2017/09/Ledger_logo_footer@2x.png" />
        </Center>
      </CoinButton>
      <CoinButton value="d">
        <Center>
          <Image src="https://www.ledger.fr/wp-content/uploads/2017/09/Ledger_logo_footer@2x.png" />
        </Center>
      </CoinButton>
      <CoinButton value="e">
        <Center>
          <Image src="https://www.ledger.fr/wp-content/uploads/2017/09/Ledger_logo_footer@2x.png" />
        </Center>
      </CoinButton>
      <CoinButton value="f">
        <Center>
          <Image src="https://www.ledger.fr/wp-content/uploads/2017/09/Ledger_logo_footer@2x.png" />
        </Center>
      </CoinButton>
    </Coins>
  </div>
);
export default ImportWallet;

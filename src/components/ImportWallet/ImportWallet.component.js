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

class ImportWallet extends React.Component {
  onChange = e => {
    this.props.changeSelectedWallet &&
      this.props.changeSelectedWallet(e.target.value);
  };
  onGoBack = e => {
    this.props.onGoBack && this.props.onGoBack();
  };
  render() {
    return (
      <div>
        <Between>
          <Flex>
            <LeftArrow type="arrow-left" onClick={this.onGoBack} />
            <span>Importing Wallet</span>
          </Flex>
          <div>
            <CreateButton>
              <Icon type="plus" />Create new wallet
            </CreateButton>
          </div>
        </Between>
        <Coins onChange={this.onChange}>
          {this.props.wallets.map((wallet, index) => (
            <CoinButton value={wallet.value} key={index}>
              <Center>
                <Image src={wallet.src} />
              </Center>
            </CoinButton>
          ))}
        </Coins>
      </div>
    );
  }
}
export default ImportWallet;

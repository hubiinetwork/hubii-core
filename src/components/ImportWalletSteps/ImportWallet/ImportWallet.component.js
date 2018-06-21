import * as React from 'react';
import PropTypes from 'prop-types';
import { Icon, Button } from 'antd';
import {
  Flex,
  Coins,
  Image,
  Center,
  Between,
  SpanText,
  LeftArrow,
  CoinButton,
  CreateButton,
} from './ImportWallet.style';

class ImportWallet extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onGoBack = this.onGoBack.bind(this);
  }

  onChange(e) {
    const { changeSelectedWallet } = this.props;
    if (changeSelectedWallet) {
      changeSelectedWallet(e.target.value);
    }
  }
  onGoBack() {
    const { onGoBack } = this.props;
    if (onGoBack) {
      this.props.onGoBack();
    }
  }
  render() {
    return (
      <div>
        <Between>
          <Flex>
            <LeftArrow type="arrow-left" onClick={this.onGoBack} />
            <SpanText>Importing Wallet</SpanText>
          </Flex>
          <div>
            <CreateButton>
              <Icon type="plus" />Create new wallet
            </CreateButton>
          </div>
        </Between>
        <Coins onChange={this.onChange}>
          {this.props.wallets.map((wallet) => (
            <CoinButton value={wallet.value} key={wallet.value}>
              <Center>
                <Image src={wallet.src} />
              </Center>
            </CoinButton>
          ))}
          <Button type="primary" onClick={this.changeSelectedWallet}>
            next
          </Button>
        </Coins>
      </div>
    );
  }
}

ImportWallet.propTypes = {
  /**
   * Array of contacts whose list is to be shown.
   */
  wallets: PropTypes.array.isRequired,
  /**
   * Function to be executed when back button is pressed
   */
  onGoBack: PropTypes.func,
  /**
   * Function to be executed when wallet is selected
   */
  changeSelectedWallet: PropTypes.func,
};

export default ImportWallet;

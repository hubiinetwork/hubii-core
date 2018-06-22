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
    this.state = {
      disabled: true,
    };
    this.onChange = this.onChange.bind(this);
    this.onGoBack = this.onGoBack.bind(this);
    this.handleNext2 = this.handleNext2.bind(this);
  }

  onChange(e) {
    const { changeSelectedWallet } = this.props;
    if (changeSelectedWallet) {
      changeSelectedWallet(e.target.value);
      this.setState({ disabled: false });
    }
  }
  onGoBack() {
    const { onGoBack } = this.props;
    if (onGoBack) {
      this.props.onGoBack();
    }
  }
  handleNext2(e) {
    const { changeSelectedWallet } = this.props;
    const { handleNext2 } = this.props;
    e.preventDefault();
    console.log('here', changeSelectedWallet);
    handleNext2();
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
          <Button type="primary" disabled={this.state.disabled} onClick={this.handleNext2}>
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
   * Function to be executed when back button is pressed
   */
  handleNext2: PropTypes.func,
  /**
   * Function to be executed when wallet is selected
   */
  changeSelectedWallet: PropTypes.func,
};

export default ImportWallet;

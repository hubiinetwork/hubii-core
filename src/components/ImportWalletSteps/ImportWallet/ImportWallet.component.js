import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Coins,
  Image,
  Center,
  CoinButton,
  ButtonDiv,
  StyledSpan,
  StyledButton,
} from './ImportWallet.style';

class ImportWallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCoin: '',
    };
    this.onChange = this.onChange.bind(this);
    this.handleNext = this.handleNext.bind(this);
  }

  onChange(e) {
    this.setState({ currentCoin: e.target.value });
  }

  handleNext(e) {
    const { handleNext } = this.props;
    const { currentCoin } = this.state;
    e.preventDefault();
    handleNext({ coin: currentCoin });
  }

  render() {
    const { currentCoin } = this.state;
    return (
      <div>
        <Coins onChange={this.onChange}>
          {this.props.wallets.map((wallet) => (
            <CoinButton value={wallet.name} key={wallet.name}>
              <Center>
                <Image src={wallet.src} />
              </Center>
            </CoinButton>
          ))}
        </Coins>
        <ButtonDiv>
          <StyledButton disabled={currentCoin === ''} onClick={this.handleNext}>
            <StyledSpan>Next</StyledSpan>
          </StyledButton>
        </ButtonDiv>
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
  handleNext: PropTypes.func,

};

export default ImportWallet;

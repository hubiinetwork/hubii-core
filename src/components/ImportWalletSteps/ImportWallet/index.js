import * as React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import Text from 'components/ui/Text';

import {
  OptionsWrapper,
  Image,
  Center,
  Option,
  StyledButton,
  OptionText,
  Header,
  Wrapper,
} from './style';

class ImportWallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      walletType: '',
    };
    this.onChange = this.onChange.bind(this);
    this.handleNext = this.handleNext.bind(this);
  }

  onChange(e) {
    this.setState({ walletType: e.target.value });
  }

  handleNext(e) {
    const { handleNext } = this.props;
    const { walletType } = this.state;
    e.preventDefault();
    handleNext({ walletType });
  }

  render() {
    const { walletType } = this.state;
    const { formatMessage } = this.props.intl;
    return (
      <Wrapper>
        <Header>{formatMessage({ id: 'store_wallet_question' })}</Header>
        <OptionsWrapper onChange={this.onChange}>
          {this.props.wallets.map((wallet) => (
            <Option value={wallet.name} key={wallet.name}>
              <Center>
                {
                  wallet.src ? <Image src={wallet.src} /> : <OptionText>{wallet.name}</OptionText>
                }
              </Center>
            </Option>
          ))}
        </OptionsWrapper>
        <StyledButton type={'primary'} disabled={walletType === ''} onClick={this.handleNext}>
          <Text>{formatMessage({ id: 'next' })}</Text>
        </StyledButton>
      </Wrapper>
    );
  }
}

ImportWallet.propTypes = {
  /**
   * Array of contacts whose list is to be shown.
   */
  wallets: PropTypes.array.isRequired,
  /**
   * Function to be executed when next button is pressed
   */
  handleNext: PropTypes.func,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(ImportWallet);

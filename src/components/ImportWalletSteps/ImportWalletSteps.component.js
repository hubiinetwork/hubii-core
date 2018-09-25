import React from 'react';
import PropTypes from 'prop-types';

import DerivationPathContainer from 'containers/DerivationPathContainer';

import {
  NavigationWrapper,
  Wrapper,
  SpanText,
  LeftArrow,
} from './ImportWalletSteps.style';

import ImportWallet from './ImportWallet';
import ImportWalletNameForm from './ImportWalletNameForm';
import ImportWalletPrivateKeyForm from './ImportWalletPrivateKeyForm';
import ImportWalletMnemonicForm from './ImportWalletMnemonicForm';
import ImportWalletKeystoneForm from './ImportWalletKeystoneForm';
import FormSteps from '../FormSteps';

export default class ImportWalletSteps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      selectedWallet: { src: '', name: '' },
      data: [],
    };
    this.searchSRC = this.searchSRC.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleNext = this.handleNext.bind(this);
  }

  getSteps() {
    const { selectedWallet } = this.state;
    const { wallets, loading } = this.props;
    const steps = [
      {
        title: 'First',
        content: (
          <ImportWallet
            handleNext={this.handleNext}
            wallets={wallets}
          />
        ),
      },
    ];
    const stepTypes = {
      ledger: [
        {
          title: 'Second',
          content: (
            <DerivationPathContainer
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              deviceType="lns"
              pathBase={'m/44\'/60\'/0\''}
            />
            ),
        },
        {
          title: 'Last',
          content: (
            <ImportWalletNameForm
              wallet={selectedWallet}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              loading={loading}
            />
          ),
        },

      ],
      Trezor: [
        {
          title: 'Second',
          content: (
            <DerivationPathContainer
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              deviceType="trezor"
              pathBase={'m/44\'/60\'/0\'/0'}
            />
            ),
        },
        {
          title: 'Last',
          content: (
            <ImportWalletNameForm
              wallet={selectedWallet}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              loading={loading}
            />
          ),
        },

      ],
      'Private key': [
        {
          title: 'Last',
          content: (
            <ImportWalletPrivateKeyForm
              wallet={selectedWallet}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              loading={loading}
            />
          ),
        },
      ],
      Mnemonic: [
        {
          title: 'Last',
          content: (
            <ImportWalletMnemonicForm
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              loading={loading}
            />
          ),
        },
      ],
      Keystone: [
        {
          title: 'Last',
          content: (
            <ImportWalletKeystoneForm
              handleBack={this.handleBack}
              handleNext={this.handleNext}
              loading={loading}
            />
          ),
        },
      ],
    };
    return steps.concat(stepTypes[selectedWallet.name || 'Private key' || 'Mnemonic']);
  }

  searchSRC(logoName, wallets) {
    return wallets.find((wallet) => wallet.name === logoName);
  }

  handleBack() {
    this.setState(({ current }) => ({ current: current - 1 }));
  }

  handleNext(stepData) {
    const { wallets } = this.props;
    this.setState((prev) => {
      const { data, current } = prev;
      data[current] = stepData;
      const steps = this.getSteps();
      if (current === steps.length - 1) {
        return this.props.handleSubmit(data);
      }
      if (current === 0) {
        const selectedWallet = this.searchSRC(stepData.walletType, wallets);
        return { data, current: current + 1, selectedWallet };
      }
      return { data, current: current + 1 };
    });
  }

  render() {
    const { current } = this.state;
    const { onBackIcon } = this.props;

    const FormNavigation = (
      <Wrapper>
        <NavigationWrapper>
          <LeftArrow type="arrow-left" onClick={() => onBackIcon()} />
          <SpanText>Import an existing wallet</SpanText>
        </NavigationWrapper>
      </Wrapper>
    );
    const steps = this.getSteps();
    return (
      <FormSteps steps={steps} currentStep={current} beforeContent={FormNavigation} />
    );
  }
}

ImportWalletSteps.propTypes = {
  wallets: PropTypes.array,
  handleSubmit: PropTypes.func.isRequired,
  onBackIcon: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

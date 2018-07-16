import React from 'react';
import PropTypes from 'prop-types';

import LnsDerivationPathContainer from 'containers/LnsDerivationPathContainer';

import {
  Flex,
  Between,
  SpanText,
  LeftArrow,
} from './ImportWalletSteps.style';

import ImportWallet from './ImportWallet';
import ImportWalletNameForm from './ImportWalletNameForm';
import ImportWalletPrivateKeyForm from './ImportWalletPrivateKeyForm';
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
    const { wallets } = this.props;
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
            <LnsDerivationPathContainer
              handleBack={this.handleBack}
              handleNext={this.handleNext}
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
            />
          ),
        },
      ],
      'Private Key': [
        {
          title: 'Last',
          content: (
            <ImportWalletPrivateKeyForm
              wallet={selectedWallet}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
            />
          ),
        },
      ],
    };
    return steps.concat(stepTypes[selectedWallet.name || 'Private Key']);
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
    const { current, data } = this.state;
    const { onBackIcon } = this.props;
    const FormNavigation = (
      <Between>
        <Flex>
          <LeftArrow type="arrow-left" onClick={() => onBackIcon()} />
          <SpanText>Importing {data[0] && data[0].coin} Wallet</SpanText>
        </Flex>
      </Between>
    );
    const steps = this.getSteps();
    return (
      <FormSteps steps={steps} currentStep={current} beforeContent={FormNavigation} />
    );
  }
}

ImportWalletSteps.propTypes = {
  wallets: PropTypes.array,
  handleSubmit: PropTypes.func,
  onBackIcon: PropTypes.func,
};

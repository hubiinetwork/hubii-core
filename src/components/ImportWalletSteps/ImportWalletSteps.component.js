/* eslint-disable */
import React from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import {
  Flex,
  Between,
  SpanText,
  LeftArrow,
  CreateButton,
} from './ImportWalletSteps.style';
import DerivationPath from "./DerivationPath";
import ImportWallet from './ImportWallet';
import ImportWalletNameForm from './ImportWalletNameForm';
import ImportWalletPasswordForm from './ImportWalletPasswordForm';
import FormSteps from '../FormSteps';

const paths = [
  {
    title: 'm/44’/60’/0’/3',
    subtitle: 'Jaxx, Metamask, Exodus, imToken, TREZOR (ETH) & Digital Bitbox'
  },
  {
    title: 'm/44’/60’/0',
    subtitle: 'Ledger (ETH)'
  },
  {
    title: 'm/44’/60’/0’/5',
    subtitle: 'TREZOR (ETC)'
  },
  {
    title: 'm/44’/60’/160720’/0’',
    subtitle: 'Ledger (ETC)'
  },
  {
    title: 'm/44’/60’/0’/7',
    subtitle: 'SingularDTV'
  },
  {
    title: 'm/44’/60’/0’/1',
    subtitle: 'Network: Testnets'
  },
  {
    title: 'm/44’/60’/0’/9',
    subtitle: 'Network: Expanse'
  }
];
const addressData = [
  {
    key: '1',
    address: '042f500111f0BDc4f6711xFBb1b73C4dcA266ce6Ef',
    balance: '0.05 ETH',
    tokenBalance: 123
  },
  {
    key: '2',
    address: '03C4f0BDc4xFA266cBb1b7f67dce6Ef42f01111150',
    balance: '0.05 ETH',
    tokenBalance: 321
  },
  {
    key: '3',
    address: '0xFBb150011BDc4f6111b73C4f07dcA266Ef426cef',
    balance: '0.05 ETH',
    tokenBalance: 542
  }
];

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
      const steps = this.getSteps()
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

  getSteps () {
    const {selectedWallet} = this.state
    const {wallets} = this.props
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
            <DerivationPath
            walletName={'selectedWallet'}
            paths={paths}
            addresses={addressData}
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
      metamask: [
        {
          title: 'Last',
          content: (
            <ImportWalletPasswordForm
              wallet={selectedWallet}
              handleBack={this.handleBack}
              handleNext={this.handleNext}
            />
          ),
        },
      ]
    }
    return steps.concat(stepTypes[selectedWallet.name || 'metamask'])
  }

  render() {
    const { current, data} = this.state;
    const { onBackIcon, } = this.props;
    const FormNavigation = (
      <Between>
        <Flex>
          <LeftArrow type="arrow-left" onClick={() => onBackIcon()} />
          <SpanText>Importing {data[0] && data[0].coin} Wallet</SpanText>
        </Flex>
        <div>
          <CreateButton>
            <Icon type="plus" />Create new wallet
            </CreateButton>
        </div>
      </Between>
    );
    const steps = this.getSteps()
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

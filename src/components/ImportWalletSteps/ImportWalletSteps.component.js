import React from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import {
  TextDiv,
  SpaceBetween,
  CreateButton,
  Between,
  SpanText,
  LeftArrow,
  Flex,
} from './ImportWalletSteps.style';
import { StyledStep, StepsCentered } from '../ui/Steps';
import ImportWallet from './ImportWallet';
import ImportWalletForm from './ImportWalletForm';
import ImportWalletNameForm from './ImportWalletNameForm';

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
      if (current === 2) {
        return this.props.handleSubmit(data);
      }
      if (current === 0) {
        const selectedWallet = this.searchSRC(stepData.coin, wallets);
        return { data, current: current + 1, selectedWallet };
      }
      return { data, current: current + 1 };
    });
  }

  render() {
    const { current, data, selectedWallet } = this.state;
    const { onBackIcon, wallets } = this.props;
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
      {
        title: 'Second',
        content: <ImportWalletForm
          wallet={selectedWallet}
          handleBack={this.handleBack}
          handleNext={this.handleNext}
        />,
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
    ];
    return (
      <SpaceBetween>
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
        {steps[this.state.current].content}
        <div>
          <TextDiv>
            Step {this.state.current + 1} of {steps.length}
          </TextDiv>
          <StepsCentered current={current}>
            {steps.map((item) => (
              <StyledStep key={item.title} title={item.title} />
            ))}
          </StepsCentered>
        </div>
      </SpaceBetween>
    );
  }
}

ImportWalletSteps.propTypes = {
  wallets: PropTypes.array,
  handleSubmit: PropTypes.func,
  onBackIcon: PropTypes.func,
};

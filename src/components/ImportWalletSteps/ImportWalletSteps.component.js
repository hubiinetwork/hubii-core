import React from 'react';
import { message } from 'antd';
import {
  TextDiv,
  ButtonDiv,
  StyledSpan,
  StyledButton,
  SpaceBetween,
  StyledBackButton,
} from './ImportWalletSteps.style';
import { StyledStep, StepsCentered } from '../ui/Steps';
import ImportWallet from './ImportWallet';
import ImportWalletForm from './ImportWalletForm';
import ImportWalletNameForm from './ImportWalletNameForm';

const walletData = [
  {
    src:
      'https://www.ledger.fr/wp-content/uploads/2017/09/Ledger_logo_footer@2x.png',
    value: 'ledger',
  },
  {
    src: 'https://new.consensys.net/wp-content/uploads/2018/01/Metamask.png',
    value: 'metamask',
  },
  {
    src:
      'https://cdn-images-1.medium.com/max/1600/1*u3_I95cOdCBd3gBJrBd2Aw.png',
    value: 'parity',
  },
  {
    src: 'https://pbs.twimg.com/media/Cxy4iJVXcAMJr9y.png',
    value: 'digitalBitbox',
  },
  {
    src:
      'https://www.ledger.fr/wp-content/uploads/2017/09/Ledger_logo_footer@2x.png',
    value: 'ledger1',
  },
  {
    src: 'https://new.consensys.net/wp-content/uploads/2018/01/Metamask.png',
    value: 'metamask1',
  },
  {
    src:
      'https://cdn-images-1.medium.com/max/1600/1*u3_I95cOdCBd3gBJrBd2Aw.png',
    value: 'parity1',
  },
  {
    src: 'https://pbs.twimg.com/media/Cxy4iJVXcAMJr9y.png',
    value: 'digitalBitbox1',
  },
  {
    src: 'https://pbs.twimg.com/media/Cxy4iJVXcAMJr9y.png',
    value: 'digitalBitbox2',
  },
  {
    src: 'https://new.consensys.net/wp-content/uploads/2018/01/Metamask.png',
    value: 'metamask2',
  },
];

export default class ImportWalletSteps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      disabled: true,
      selectedWallet: { src: '', value: '' },
    };
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.searchSRC = this.searchSRC.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.disbaleAgain = this.disbaleAgain.bind(this);
    this.changeSelectedWallet = this.changeSelectedWallet.bind(this);
  }

  searchSRC(logoName, myArray) {
    for (let i = 0; i < myArray.length; i += 1) {
      if (myArray[i].value === logoName) {
        return myArray[i];
      }
    }
    return '';
  }

  changeSelectedWallet(value) {
    this.setState({
      selectedWallet: this.searchSRC(value, walletData),
      disabled: false,
    });
  }

  disbaleAgain() {
    this.setState(
      {
        disabled: true,
        selectedWallet: { src: '', value: '' },
      }
  );
  }

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
    if (current === 0) {
      this.disbaleAgain();
    }
  }
  handleBack() {
    const current = this.state.current - 1;
    this.setState({ current });
    if (current === 0) {
      this.disbaleAgain();
    }
  }
  handleNext(data) {
    // console.log('dat', data);
    if (data.Address !== undefined && data.key !== undefined) {
      const current = this.state.current + 1;
      this.setState({ current });
    }
  }
  render() {
    const { current } = this.state;

    const steps = [
      {
        title: 'First',
        content: (
          <ImportWallet
            changeSelectedWallet={this.changeSelectedWallet}
            onGoBack={this.disbaleAgain}
            wallets={walletData}
          />
        ),
      },
      {
        title: 'Second',
        content: <ImportWalletForm
          wallet={this.state.selectedWallet}
          handleBack={this.handleBack}
          handleNext={this.handleNext}
        />,
      },
      {
        title: 'Last',
        content: (
          <ImportWalletNameForm
            wallet={this.state.selectedWallet}
            onGoBack={this.prev}
          />
        ),
      },
    ];
    return (
      <SpaceBetween>
        <div>{steps[this.state.current].content}</div>
        <div>
          <ButtonDiv>
            {this.state.current > 0 && (
              <StyledBackButton type="primary" onClick={() => this.prev()}>
                <StyledSpan>Back</StyledSpan>
              </StyledBackButton>
            )}
            {this.state.current < steps.length - 1 && (
              <StyledButton
                type="primary"
                onClick={() => this.next()}
                current={this.state.current}
                disabled={this.state.disabled}
              >
                <StyledSpan>Next</StyledSpan>
              </StyledButton>
            )}
            {this.state.current === steps.length - 1 && (
              <StyledButton
                type="primary"
                onClick={() => message.success('Processing complete!')}
              >
                <StyledSpan>Finish</StyledSpan>
              </StyledButton>
            )}
          </ButtonDiv>
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


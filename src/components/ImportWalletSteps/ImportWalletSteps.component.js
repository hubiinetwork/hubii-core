import React from 'react';
import { message } from 'antd';
import {
  StyledStep,
  StyledButton,
  StyledBackButton,
  StepsCentered,
  ButtonDiv,
  TextDiv,
  SpaceBetween
} from './ImportWalletSteps.style';
import ImportWallet from '../ImportWallet';
import ImportWalletForm from '../ImportWalletForm';
import ImportWalletNameForm from '../ImportWalletNameForm';

const walletData = [
  {
    src:
      'https://www.ledger.fr/wp-content/uploads/2017/09/Ledger_logo_footer@2x.png',
    value: 'ledger'
  },
  {
    src: 'https://new.consensys.net/wp-content/uploads/2018/01/Metamask.png',
    value: 'metamask'
  },
  {
    src:
      'https://cdn-images-1.medium.com/max/1600/1*u3_I95cOdCBd3gBJrBd2Aw.png',
    value: 'parity'
  },
  {
    src: 'https://pbs.twimg.com/media/Cxy4iJVXcAMJr9y.png',
    value: 'digitalBitbox'
  },
  {
    src:
      'https://www.ledger.fr/wp-content/uploads/2017/09/Ledger_logo_footer@2x.png',
    value: 'ledger1'
  },
  {
    src: 'https://new.consensys.net/wp-content/uploads/2018/01/Metamask.png',
    value: 'metamask1'
  },
  {
    src:
      'https://cdn-images-1.medium.com/max/1600/1*u3_I95cOdCBd3gBJrBd2Aw.png',
    value: 'parity1'
  },
  {
    src: 'https://pbs.twimg.com/media/Cxy4iJVXcAMJr9y.png',
    value: 'digitalBitbox1'
  }
];

export default class ImportWalletSteps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      disabled: true,
      selectedWallet: { src: '', value: '' }
    };
    this.changeSelectedWallet = this.changeSelectedWallet.bind(this);
  }

  searchSRC = (logoName, myArray) => {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].value === logoName) {
        return myArray[i];
      }
    }
  };

  changeSelectedWallet = value => {
    this.setState({
      selectedWallet: this.searchSRC(value, walletData),
      disabled: false
    });
    console.log('Changed State is: ', this.state.selectedWallet);
  };

  disbaleAgain = () => {
    this.setState({ disabled: true, selectedWallet: { src: '', value: '' } });
  };

  next = () => {
    const current = this.state.current + 1;
    this.setState({ current });
  };

  prev = () => {
    const current = this.state.current - 1;
    this.setState({ current });
    current === 0 && this.disbaleAgain();
  };
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
        )
      },
      {
        title: 'Second',
        content: <ImportWalletForm wallet={this.state.selectedWallet} />
      },
      {
        title: 'Last',
        content: (
          <ImportWalletNameForm
            wallet={this.state.selectedWallet}
            onGoBack={this.prev}
          />
        )
      }
    ];
    return (
      <SpaceBetween>
        <div>{steps[this.state.current].content}</div>
        <div>
          <ButtonDiv>
            {this.state.current > 0 && (
              <StyledBackButton type="primary" onClick={() => this.prev()}>
                Back
              </StyledBackButton>
            )}
            {this.state.current < steps.length - 1 && (
              <StyledButton
                type="primary"
                onClick={() => this.next()}
                current={this.state.current}
                disabled={this.state.disabled}
              >
                Next
              </StyledButton>
            )}
            {this.state.current === steps.length - 1 && (
              <StyledButton
                type="primary"
                onClick={() => message.success('Processing complete!')}
              >
                Finish
              </StyledButton>
            )}
          </ButtonDiv>
          <TextDiv>
            Step {this.state.current + 1} of {steps.length}
          </TextDiv>
          <StepsCentered current={current}>
            {steps.map(item => (
              <StyledStep key={item.title} title={item.title} />
            ))}
          </StepsCentered>
        </div>
      </SpaceBetween>
    );
  }
}

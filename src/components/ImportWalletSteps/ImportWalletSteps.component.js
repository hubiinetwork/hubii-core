import React from 'react';
import { Steps, message } from 'antd';
import {
  StyledStep,
  StyledButton,
  StyledBackButton,
  StepsCentered,
  ButtonDiv,
  TextDiv
} from './ImportWalletSteps.style';
import ImportWallet from '../ImportWallet';
import ImportWalletForm from '../ImportWalletForm';
import ImportWalletNameForm from '../ImportWalletNameForm';

const steps = [
  {
    title: 'First',
    content: <ImportWallet />
  },
  {
    title: 'Second',
    content: <ImportWalletForm />
  },
  {
    title: 'Last',
    content: <ImportWalletNameForm />
  }
];

export default class ImportWalletSteps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0
    };
  }
  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }
  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }
  render() {
    const { current } = this.state;
    return (
      <div>
        <div>{steps[this.state.current].content}</div>
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
    );
  }
}

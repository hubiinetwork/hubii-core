import React from 'react';
import { Steps, Button, message } from 'antd';
import { StyledStep, ButtonDiv } from './ImportWalletSteps.style';
import ImportWallet from '../ImportWallet';

const steps = [
  {
    title: 'First',
    content: <ImportWallet />
  },
  {
    title: 'Second',
    content: 'Second-content'
  },
  {
    title: 'Last',
    content: 'Last-content'
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
        <div className="steps-content">{steps[this.state.current].content}</div>
        <ButtonDiv>
          {this.state.current > 0 && (
            <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
              Back
            </Button>
          )}
          {this.state.current < steps.length - 1 && (
            <Button type="primary" onClick={() => this.next()}>
              Next
            </Button>
          )}
          {this.state.current === steps.length - 1 && (
            <Button
              type="primary"
              onClick={() => message.success('Processing complete!')}
            >
              Finish
            </Button>
          )}
        </ButtonDiv>
        <Steps current={current}>
          {steps.map(item => (
            <StyledStep key={item.title} title={item.title} />
          ))}
        </Steps>
      </div>
    );
  }
}

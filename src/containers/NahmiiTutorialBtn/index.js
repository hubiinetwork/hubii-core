/**
 *
 * NahmiiTutorialBtn
 *
 */

import React from 'react';
// import { shell } from 'electron';
import PropTypes from 'prop-types';

import { Modal } from 'components/ui/Modal';

import {
  StyledIcon,
} from './style';


class NahmiiTutorialBtn extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = { visible: false };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  showModal() {
    this.setState({
      visible: true,
    });
  }

  hideModal() {
    this.setState({
      visible: false,
    });
  }

  render() {
    return (
      <div style={{ ...this.props.style, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <StyledIcon
          onClick={this.showModal}
          type="question-circle"
        />
        <Modal
          title="What is nahmii?"
          visible={this.state.visible}
          footer={null}
          onOk={this.hideModal}
          onCancel={this.hideModal}
        >
          <p>nahmii is a second layer scaling solution for Ethereum..........</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </div>
    );
  }
}

NahmiiTutorialBtn.propTypes = {
  style: PropTypes.object,
};

export default NahmiiTutorialBtn;

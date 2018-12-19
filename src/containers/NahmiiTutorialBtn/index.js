/**
 *
 * NahmiiTutorialBtn
 *
 */

import React from 'react';
// import { shell } from 'electron';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Checkbox } from 'antd';

import {
  enableNahmiiMainnet,
  disableNahmiiMainnet,
} from 'containers/NahmiiHoc/actions';

import {
  makeSelectDisclaimerModal,
} from 'containers/NahmiiHoc/selectors';

import { Modal } from 'components/ui/Modal';
import Button from 'components/ui/Button';

import {
  StyledIcon,
} from './style';


class NahmiiTutorialBtn extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    const mainnetEnabled = props.disclaimerModal.get('enableMainnet');
    this.state = { visible: false, cb1Checked: mainnetEnabled, cb2Checked: mainnetEnabled };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.toggleMainnet = this.toggleMainnet.bind(this);
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

  toggleMainnet(e) {
    if (e.target.checked) {
      this.props.enableMainnet();
    } else {
      this.props.disableMainnet();
    }
  }

  render() {
    const { cb1Checked, cb2Checked } = this.state;
    const { disclaimerModal, iconOnly, forceIcon } = this.props;
    const showIcon = forceIcon || disclaimerModal.get('showBtn');
    return (
      <div style={{ ...this.props.style, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <StyledIcon
          onClick={!iconOnly ? this.showModal : null}
          type="question-circle"
          style={!showIcon ? { display: 'none' } : {}}
        />
        <Modal
          title="What is nahmii?"
          visible={this.state.visible}
          footer={null}
          onOk={this.hideModal}
          onCancel={this.hideModal}
        >
          <p>nahmii is a second layer scaling solution for the Ethereum blockchain, which offers faster and cheaper transactions than the Ethereum base layer.</p>
          <p>To move funds in and out of the nahmii second layer, you need to send on-chain transactions to a nahmii smart contract. You can easily make these on-chain transactions using hubii core, the nahmii SDK or the nahmii CLI.</p>
          <p>Once your funds are in the nahmii smart contract, you can use them to transact on the nahmii network, again using core, the SDK, or CLI.</p>
          <p>nahmii is experimental technology. While in these early stages, we recommend only using nahmii on the Ethereum testnet Ropsten.</p>
          <p>If you wish to use nahmii on the Ethereum mainnet, you must acknowledge that due to risk of bugs, any funds deposited into nahmii may be lost forever. Only deposit funds you are willing to lose.</p>
          <Checkbox
            disabled={disclaimerModal.get('enableMainnet')}
            checked={disclaimerModal.get('enableMainnet') || cb1Checked}
            onChange={() => this.setState({ cb1Checked: !cb1Checked })}
          >
            I understand nahmii is experimental technology and there is no guarantee funds deposited will not be lost forever
          </Checkbox>
          <Checkbox
            disabled={disclaimerModal.get('enableMainnet')}
            checked={disclaimerModal.get('enableMainnet') || cb2Checked}
            onChange={() => this.setState({ cb2Checked: !cb2Checked })}
          >
            I understand withdrawals on the nahmii mainnet are disabled until Q1 2019
          </Checkbox>
          <Checkbox
            disabled={!cb1Checked || !cb2Checked}
            checked={disclaimerModal.get('enableMainnet')}
            onChange={this.toggleMainnet}
          >
            Enable nahmii deposits on the Ethereum mainnet
          </Checkbox>
          <br />
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <Button onClick={this.hideModal}>
              Close
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}

NahmiiTutorialBtn.propTypes = {
  style: PropTypes.object,
  iconOnly: PropTypes.bool,
  forceIcon: PropTypes.bool,
  enableMainnet: PropTypes.func.isRequired,
  disableMainnet: PropTypes.func.isRequired,
  disclaimerModal: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  disclaimerModal: makeSelectDisclaimerModal(),
});

function mapDispatchToProps(dispatch) {
  return {
    enableMainnet: () => dispatch(enableNahmiiMainnet()),
    disableMainnet: () => dispatch(disableNahmiiMainnet()),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
  injectIntl,
)(NahmiiTutorialBtn);

/**
 *
 * NahmiiInfoBtn
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


class NahmiiInfoBtn extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
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
    const { disclaimerModal, iconOnly, forceIcon, intl } = this.props;
    const { formatMessage } = intl;
    const showIcon = forceIcon || disclaimerModal.get('showBtn');
    return (
      <div style={{ ...this.props.style, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <StyledIcon
          onClick={!iconOnly ? this.showModal : null}
          type="question-circle"
          style={!showIcon ? { display: 'none' } : {}}
        />
        <Modal
          title={formatMessage({ id: 'what_is_nahmii' })}
          visible={this.state.visible}
          footer={null}
          onOk={this.hideModal}
          onCancel={this.hideModal}
        >
          <p>{formatMessage({ id: 'nahmii_disclaimer_txt_1' })}</p>
          <p>{formatMessage({ id: 'nahmii_disclaimer_txt_2' })}</p>
          <p>{formatMessage({ id: 'nahmii_disclaimer_txt_3' })}</p>
          <p>{formatMessage({ id: 'nahmii_disclaimer_txt_4' })}</p>
          <p>{formatMessage({ id: 'nahmii_disclaimer_txt_5' })}</p>
          <Checkbox
            disabled={disclaimerModal.get('enableMainnet')}
            checked={disclaimerModal.get('enableMainnet') || cb1Checked}
            onChange={() => this.setState({ cb1Checked: !cb1Checked })}
          >
            {formatMessage({ id: 'nahmii_disclaimer_cb_1' })}
          </Checkbox>
          <Checkbox
            disabled={disclaimerModal.get('enableMainnet')}
            checked={disclaimerModal.get('enableMainnet') || cb2Checked}
            onChange={() => this.setState({ cb2Checked: !cb2Checked })}
          >
            {formatMessage({ id: 'nahmii_disclaimer_cb_2' })}
          </Checkbox>
          <Checkbox
            disabled={!cb1Checked || !cb2Checked}
            checked={disclaimerModal.get('enableMainnet')}
            onChange={this.toggleMainnet}
          >
            {formatMessage({ id: 'nahmii_disclaimer_cb_3' })}
          </Checkbox>
          <br />
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <Button onClick={this.hideModal}>
              {formatMessage({ id: 'close' })}
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}

NahmiiInfoBtn.propTypes = {
  style: PropTypes.object,
  intl: PropTypes.object,
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
)(NahmiiInfoBtn);

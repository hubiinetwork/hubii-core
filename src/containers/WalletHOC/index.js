import * as React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';

import { Modal } from 'components/ui/Modal';
import { FormItem, FormItemLabel } from 'components/ui/Form';

import Input from 'components/ui/Input';
import Button from 'components/ui/Button';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import {
  makeSelectCurrentWallet,
  makeSelectCurrentWalletDetails,
} from './selectors';
import {
  decryptWallet,
  hideDecryptWalletModal,
  startLedgerSync,
  loadWalletsBalances,
} from './actions';

export default function WalletHOC(Component) {
  const HOC = getComponentHOC(Component);

  const mapStateToProps = createStructuredSelector({
    currentWallet: makeSelectCurrentWallet(),
    currentWalletDetails: makeSelectCurrentWalletDetails(),
  });

  const withConnect = connect(mapStateToProps, mapDispatchToProps);

  const withReducer = injectReducer({ key: 'walletHoc', reducer });
  const withSaga = injectSaga({ key: 'walletHoc', saga });

  return compose(
    withReducer,
    withSaga,
    withConnect,
  )(HOC);
}

export function getComponentHOC(Component) {
  class HOC extends React.Component {
    constructor(...args) {
      super(...args);
      this.state = {};
      this.onPasswordChange = this.onPasswordChange.bind(this);
      this.decryptWallet = this.decryptWallet.bind(this);
      this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    componentDidMount() {
      this.props.startLedgerSync();
      this.props.loadWalletsBalances();
    }

    componentWillReceiveProps(prevProps) {
      if (!prevProps.currentWallet.toJS().showDecryptModal && this.props.currentWallet.toJS().showDecryptModal) {
        this.setState({ password: null });
      }
    }

    onPasswordChange(e) {
      this.setState({ password: e.target.value });
    }

    handleKeyPress(event) {
      if (event.key === 'Enter') {
        return this.decryptWallet();
      }
      return null;
    }

    decryptWallet() {
      const { currentWalletDetails } = this.props;
      this.props.decryptWallet(currentWalletDetails.address, JSON.stringify(currentWalletDetails.encrypted), this.state.password);
    }

    render() {
      return (
        <div>
          <Component {...this.props} />
          <Modal
            footer={null}
            width={'585px'}
            maskClosable
            maskStyle={{ background: 'rgba(232,237,239,.65)' }}
            style={{ marginTop: '20px' }}
            visible={this.props.currentWallet.toJS().showDecryptModal}
            onCancel={this.props.hideDecryptWalletModal}
            destroyOnClose
          >
            <FormItem
              label={<FormItemLabel>Please enter wallet password to proceed</FormItemLabel>}
              colon={false}
            >
              <Input value={this.state.password} onChange={this.onPasswordChange} type="password" onKeyPress={(e) => this.handleKeyPress(e)} />
            </FormItem>
            <Button type="primary" onClick={this.decryptWallet} disabled={!this.state.password}>
              Confirm
            </Button>
          </Modal>
        </div>
      );
    }
  }
  HOC.propTypes = {
    currentWallet: PropTypes.object.isRequired,
    currentWalletDetails: PropTypes.object.isRequired,
    startLedgerSync: PropTypes.func.isRequired,
    loadWalletsBalances: PropTypes.func.isRequired,
    decryptWallet: PropTypes.func.isRequired,
    hideDecryptWalletModal: PropTypes.func.isRequired,
  };
  return HOC;
}

export function mapDispatchToProps(dispatch) {
  return {
    startLedgerSync: () => dispatch(startLedgerSync()),
    hideDecryptWalletModal: () => dispatch(hideDecryptWalletModal()),
    decryptWallet: (...args) => dispatch(decryptWallet(...args)),
    loadWalletsBalances: (...args) => dispatch(loadWalletsBalances(...args)),
  };
}


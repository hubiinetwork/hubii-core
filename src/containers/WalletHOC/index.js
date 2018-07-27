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
  makeSelectCurrentWalletWithInfo,
  makeSelectLoading,
} from './selectors';
import {
  decryptWallet,
  hideDecryptWalletModal,
  initLedger,
  initWalletsBalances,
} from './actions';

import {
  StyledSpin,
} from './WalletHOC.style';

export default function WalletHOC(Component) {
  const HOC = getComponentHOC(Component);

  const mapStateToProps = createStructuredSelector({
    currentWallet: makeSelectCurrentWallet(),
    currentWalletWithInfo: makeSelectCurrentWalletWithInfo(),
    loading: makeSelectLoading(),
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
      this.state = { password: null };
      this.onPasswordChange = this.onPasswordChange.bind(this);
      this.decryptWallet = this.decryptWallet.bind(this);
      this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    componentDidMount() {
      this.props.initLedger();
      this.props.initWalletsBalances();
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.currentWallet.toJS().showDecryptModal && !this.props.currentWallet.toJS().showDecryptModal) {
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
      const { currentWalletWithInfo } = this.props;
      this.props.decryptWallet(currentWalletWithInfo.get('address'), currentWalletWithInfo.get('encrypted'), this.state.password);
    }

    render() {
      const loading = this.props.loading.get('decryptingWallet');

      return (
        <div>
          <Component {...this.props} />
          <Modal
            footer={null}
            width={'585px'}
            maskClosable
            maskStyle={{ background: 'rgba(232,237,239,.65)' }}
            style={{ marginTop: '20px' }}
            visible={this.props.currentWallet.get('showDecryptModal')}
            onCancel={this.props.hideDecryptWalletModal}
            destroyOnClose
          >
            <FormItem
              label={<FormItemLabel>Please enter wallet password to proceed</FormItemLabel>}
              colon={false}
            >
              <Input value={this.state.password} onChange={this.onPasswordChange} type="password" onKeyPress={(e) => this.handleKeyPress(e)} />
            </FormItem>

            {loading ? (
              <StyledSpin
                delay={0}
                tip="Decrypting Wallet..."
              />
                ) : (
                  <Button type="primary" onClick={this.decryptWallet} disabled={!this.state.password}>
                    Confirm
                  </Button>
                )}
          </Modal>
        </div>
      );
    }
  }
  HOC.propTypes = {
    currentWallet: PropTypes.object.isRequired,
    currentWalletWithInfo: PropTypes.object.isRequired,
    initLedger: PropTypes.func.isRequired,
    initWalletsBalances: PropTypes.func.isRequired,
    decryptWallet: PropTypes.func.isRequired,
    hideDecryptWalletModal: PropTypes.func.isRequired,
    loading: PropTypes.object,
  };
  return HOC;
}

export function mapDispatchToProps(dispatch) {
  return {
    initLedger: () => dispatch(initLedger()),
    hideDecryptWalletModal: () => dispatch(hideDecryptWalletModal()),
    decryptWallet: (...args) => dispatch(decryptWallet(...args)),
    initWalletsBalances: (...args) => dispatch(initWalletsBalances(...args)),
  };
}


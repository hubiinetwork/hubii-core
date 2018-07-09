/**
 *
 * LnsDerivationPathContainer
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import {
  fetchLedgerAddresses,
} from 'containers/WalletHOC/actions';


import {
  makeSelectLedgerNanoSInfo,
  makeSelectErrors,
  makeSelectWallets,
} from 'containers/WalletHOC/selectors';


import DerivationPath from 'components/ImportWalletSteps/DerivationPath';

import { StyledButton, StyledSpan, ButtonDiv } from './BackBtn';
import { ErrorWrapper } from './ErrorWrapper';
import { ErrorText } from './ErrorText';

export class LnsDerivationPathContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      pathBase: 'm/44\'/60\'/0\'',
      firstAddressIndex: 0,
      lastAddressIndex: 19,
    };
    this.fetchAddresses = this.fetchAddresses.bind(this);
    this.onChangePathBase = this.onChangePathBase.bind(this);
    this.onSelectAddress = this.onSelectAddress.bind(this);
  }

  componentDidMount() {
    this.fetchAddresses();
  }

  onChangePathBase(e) {
    const newBase = e.target.value;
    this.setState({ ...this.state, pathBase: newBase },
      this.fetchAddresses
    );
  }

  onSelectAddress(index) {
    const derivationPath = `${this.state.pathBase}/${index}`;
    const id = this.props.ledgerNanoSInfo.get('id');
    const address = this.props.ledgerNanoSInfo.getIn(['addresses', derivationPath]);
    this.props.handleNext({ address, derivationPath, deviceId: id });
  }

  fetchAddresses() {
    const { lastAddressIndex, pathBase } = this.state;
    const { addresses } = this.props.ledgerNanoSInfo.toJS();
    let i;
    const paths = [];
    for (i = 0; i <= lastAddressIndex; i += 1) {
      const curPath = `${pathBase}/${i}`;
      if (!addresses[curPath]) {
        paths.push(curPath);
      }
    }
    this.props.fetchLedgerAddresses(paths);
  }

  render() {
    const { ledgerNanoSInfo, errors } = this.props;
    const error = errors.get('ledgerError');
    const { status, addresses } = ledgerNanoSInfo.toJS();
    if (status === 'disconnected') {
      return (
        <ErrorWrapper>
          <ErrorText>{error}</ErrorText>
        </ErrorWrapper>
      );
    }

    const { pathBase, lastAddressIndex } = this.state;
    const processedAddresses = [];
    let i;
    for (i = 0; i <= lastAddressIndex; i += 1) {
      const curDerivationPath = `${pathBase}/${i}`;
      processedAddresses.push({
        key: i,
        index: i,
        ethBalance: 'Feature coming soon',
        address: addresses[curDerivationPath] ? `${addresses[curDerivationPath].slice(0, 18)}...` : 'Loading...',
      });
    }

    return (
      <div>
        <DerivationPath
          pathBase={pathBase}
          addresses={processedAddresses}
          onChangePathBase={this.onChangePathBase}
          onSelectAddress={this.onSelectAddress}
        />
        <ButtonDiv>
          <StyledButton type={'primary'} onClick={this.props.handleBack}>
            <StyledSpan>Back</StyledSpan>
          </StyledButton>
        </ButtonDiv>
      </div>
    );
  }
}

LnsDerivationPathContainer.propTypes = {
  ledgerNanoSInfo: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  fetchLedgerAddresses: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  ledgerNanoSInfo: makeSelectLedgerNanoSInfo(),
  wallets: makeSelectWallets(),
  errors: makeSelectErrors(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    fetchLedgerAddresses: (derivationPaths) => dispatch(fetchLedgerAddresses(derivationPaths)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(LnsDerivationPathContainer);

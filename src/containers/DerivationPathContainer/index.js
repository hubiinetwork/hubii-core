/**
 *
 * DerivationPathContainer
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { utils } from 'ethers';

import { isValidPath } from 'utils/wallet';

import HWPromptContainer from 'containers/HWPromptContainer';

import {
  loadWalletBalances,
} from 'containers/HubiiApiHoc/actions';

import {
  fetchLedgerAddresses,
} from 'containers/LedgerHoc/actions';

import {
  fetchTrezorAddresses,
} from 'containers/TrezorHoc/actions';

import {
  makeSelectBalances,
} from 'containers/HubiiApiHoc/selectors';

import {
  makeSelectLedgerHoc,
} from 'containers/LedgerHoc/selectors';

import {
  makeSelectTrezorHoc,
} from 'containers/TrezorHoc/selectors';

import DerivationPath from 'components/ImportWalletSteps/DerivationPath';
import Text from 'components/ui/Text';

import { StyledButton, ButtonDiv } from './BackBtn';
import HWPromptWrapper from './HWPromptWrapper';

export class DerivationPathContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      pathTemplate: props.pathTemplate,
      firstAddressIndex: 0,
      lastAddressIndex: 9,
      customPathInput: "m/44'/60'/0'",
      pathValid: true,
    };
    this.fetchAddresses = this.fetchAddresses.bind(this);
    this.onChangePathTemplate = this.onChangePathTemplate.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
    this.onChangeCustomPath = this.onChangeCustomPath.bind(this);
    this.onSelectAddress = this.onSelectAddress.bind(this);
  }

  componentDidMount() {
    if (this.getDeviceInfo(this.props).get('status') === 'connected') {
      this.fetchAddresses();
    }
  }

  componentDidUpdate(prevProps) {
    const { balances } = this.props;
    const { pathValid } = this.state;
    const prevStatus = this.getDeviceInfo(prevProps).get('status');
    const curStatus = this.getDeviceInfo(this.props).get('status');
    if (prevStatus === 'disconnected' && curStatus === 'connected' && pathValid) {
      this.fetchAddresses();
    }

    const curAddresses = this.getDeviceInfo(this.props).get('addresses');
    const addresses = curAddresses.valueSeq().toArray();
    addresses.forEach((address) => {
      if (!balances.get(address) && !balances.getIn([address, 'loading'])) {
        this.props.loadWalletBalances(address, true, true);
      }
    });
  }

  onChangePathTemplate(path) {
    this.setState({ pathTemplate: path, pathValid: true },
      this.fetchAddresses
    );
  }

  onChangePage(pageNum, addressesPerPage) {
    const firstAddressIndex = (pageNum - 1) * addressesPerPage;
    const lastAddressIndex = (pageNum * addressesPerPage) - 1;
    this.setState({ firstAddressIndex, lastAddressIndex },
      this.fetchAddresses);
  }

  onChangeCustomPath(customPathInput) {
    if (isValidPath(customPathInput)) {
      this.setState({ customPathInput });
      this.onChangePathTemplate(`${customPathInput}/{index}`);
    } else {
      this.setState({ customPathInput, pathValid: false });
    }
  }

  onSelectAddress(index) {
    const derivationPath = this.state.pathTemplate.replace('{index}', index);
    const id = this.getDeviceInfo(this.props).get('id');
    const address = this.getDeviceInfo(this.props).getIn(['addresses', derivationPath]);
    if (!address) {
      return;
    }
    this.props.handleNext({ address, derivationPath, deviceId: id });
  }

  getDeviceInfo(props) {
    const { deviceType } = this.props;
    let deviceInfo;
    if (deviceType === 'lns') {
      deviceInfo = props.ledgerNanoSInfo;
    }
    if (deviceType === 'trezor') {
      deviceInfo = props.trezorInfo;
    }
    return deviceInfo;
  }

  fetchAddresses() {
    const { firstAddressIndex, lastAddressIndex, pathTemplate } = this.state;
    const { deviceType } = this.props;
    const hardened = !this.state.pathTemplate.endsWith('/{index}');
    if (deviceType === 'lns') {
      this.props.fetchLedgerAddresses(pathTemplate, firstAddressIndex, lastAddressIndex, hardened);
    }
    if (deviceType === 'trezor') {
      this.props.fetchTrezorAddresses(pathTemplate, firstAddressIndex, lastAddressIndex);
    }
  }

  render() {
    const { balances, deviceType } = this.props;
    const deviceInfo = this.getDeviceInfo(this.props);

    const { status, addresses, ethConnected } = deviceInfo.toJS();
    if
    (
      (deviceType !== 'lns' && status === 'disconnected')
      || (deviceType === 'lns' && !ethConnected)
    ) {
      return (
        <HWPromptWrapper>
          <HWPromptContainer passedDeviceType={deviceType} />
        </HWPromptWrapper>
      );
    }

    const { pathTemplate, pathValid } = this.state;
    const processedAddresses = [];
    let i;
    for (i = 0; i < 100; i += 1) {
      const curDerivationPath = pathTemplate.replace('{index}', i);
      const assetsState = balances.getIn([addresses[curDerivationPath], 'assets']);
      let balance = 'Loading...';
      if (assetsState) {
        const asset = assetsState.toJSON().find((ast) => ast.currency === '0x0000000000000000000000000000000000000000');
        balance = parseFloat(utils.formatEther(asset.balance));
      }
      processedAddresses.push({
        key: i,
        index: i,
        ethBalance: balance,
        address: addresses[curDerivationPath]
          ? `${addresses[curDerivationPath].slice(0, 10)}...${addresses[curDerivationPath].slice(32, 42)}`
          : 'Loading...',
      });
    }

    return (
      <div>
        <DerivationPath
          pathTemplate={pathTemplate}
          addresses={processedAddresses}
          onChangePathTemplate={this.onChangePathTemplate}
          onSelectAddress={this.onSelectAddress}
          onChangePage={this.onChangePage}
          onChangeCustomPath={this.onChangeCustomPath}
          customPathInput={this.state.customPathInput}
          deviceType={deviceType}
          pathValid={pathValid}
        />
        <ButtonDiv>
          <StyledButton type={'primary'} onClick={this.props.handleBack}>
            <Text>Back</Text>
          </StyledButton>
        </ButtonDiv>
      </div>
    );
  }
}

DerivationPathContainer.propTypes = {
  deviceType: PropTypes.string.isRequired,
  pathTemplate: PropTypes.string.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  ledgerNanoSInfo: PropTypes.object.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  trezorInfo: PropTypes.object.isRequired,
  balances: PropTypes.object.isRequired,
  fetchLedgerAddresses: PropTypes.func.isRequired,
  fetchTrezorAddresses: PropTypes.func.isRequired,
  loadWalletBalances: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  ledgerNanoSInfo: makeSelectLedgerHoc(),
  trezorInfo: makeSelectTrezorHoc(),
  balances: makeSelectBalances(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    fetchLedgerAddresses: (...args) => dispatch(fetchLedgerAddresses(...args)),
    fetchTrezorAddresses: (...args) => dispatch(fetchTrezorAddresses(...args)),
    loadWalletBalances: (...args) => dispatch(loadWalletBalances(...args)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(DerivationPathContainer);

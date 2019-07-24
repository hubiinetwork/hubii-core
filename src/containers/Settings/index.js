import * as React from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectCurrentNetwork, makeSelectSupportedNetworks, makeSelectRestoreContents } from 'containers/App/selectors';
import { changeNetwork, batchExport, batchImport, decryptImport } from 'containers/App/actions';
import { changeLocale } from 'containers/LanguageProvider/actions';

import TopHeader from 'components/ui/TopHeader';
import Heading from 'components/ui/Heading';
import Select, { Option } from 'components/ui/Select';
import Text from 'components/ui/Text';
import { Modal } from 'components/ui/Modal';

import { makeSelectLocale } from 'containers/LanguageProvider/selectors';
import { translationMessages } from '../../i18n';

import ExportModal from './ExportModal';
import BatchImportSteps from './BatchImportSteps';

import {
  Wrapper,
  SettingWrapper,
  Body,
  StyledSectionHeading,
  StyledButton,
} from './style';

export class Settings extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { modalVisibility: false, modalType: '' };
    this.handleNetworkChange = this.handleNetworkChange.bind(this);
    this.handleExport = this.handleExport.bind(this);
    this.handleImport = this.handleImport.bind(this);
    this.handleDecryptImport = this.handleDecryptImport.bind(this);
  }

  handleNetworkChange(v) {
    const networkIds = { mainnet: 1, ropsten: 3 };
    const { onChangeNetwork, currentNetwork } = this.props;
    if (networkIds[v] !== currentNetwork.nahmiiProvider.network.chainId) {
      onChangeNetwork(v);
    }
  }

  handleExport({ password, filePath }) {
    const { onBatchExport } = this.props;
    onBatchExport(password, filePath);
    this.setState({ modalVisibility: false });
  }

  handleImport() {
    const { onBatchImport } = this.props;
    onBatchImport();
    this.setState({ modalVisibility: false });
  }

  handleDecryptImport({ password, filePath }) {
    const { onDecryptImport } = this.props;
    onDecryptImport(password, filePath);
  }

  render() {
    const { locale, onChangeLocale, currentNetwork, supportedNetworks, restoreContents, intl } = this.props;
    const { modalVisibility, modalType } = this.state;
    const { formatMessage } = intl;
    const currentNetworkText = currentNetwork.nahmiiProvider.network.chainId === 1
      ? 'Mainnet'
      : 'Ropsten [TESTNET]';

    let modal;
    switch (modalType) {
      case 'export':
        modal = (
          <ExportModal
            onExport={this.handleExport}
            onCancel={() => this.setState({ modalVisibility: false })}
          />
        );
        break;
      case 'import':
        modal = (
          <BatchImportSteps
            restoreContents={restoreContents}
            onDecrypt={this.handleDecryptImport}
            onImport={this.handleImport}
            onClose={() => this.setState({ modalVisibility: false })}
          />
        );
        break;
      default:
        break;
    }

    return (
      <Wrapper>
        <TopHeader>
          <Heading>{formatMessage({ id: 'settings' })}</Heading>
        </TopHeader>
        <Body>
          <SettingWrapper>
            <StyledSectionHeading>
              {formatMessage({ id: 'setting_network' })}
            </StyledSectionHeading>
            <Select
              value={currentNetworkText}
              style={{ width: '15rem' }}
              onChange={this.handleNetworkChange}
            >
              {
                Object.entries(supportedNetworks.toJS()).map(([key]) => {
                  const label = key !== 'mainnet' ? ' [TESTNET]' : '';
                  const name = `${key.charAt(0).toUpperCase()}${key.slice(1)}${label}`;
                  return (
                    <Option value={key} key={key}>
                      {name}
                    </Option>
                  );
                })
              }
            </Select>
          </SettingWrapper>
          <SettingWrapper>
            <StyledSectionHeading>
              {formatMessage({ id: 'setting_language' })}
            </StyledSectionHeading>
            <Select
              value={locale}
              style={{ width: '15rem' }}
              onChange={onChangeLocale}
            >
              {
                Object.keys(translationMessages).map((localeKey) => (
                  <Option value={localeKey} key={localeKey}>
                    {translationMessages[localeKey].language}
                  </Option>
                ))
              }
            </Select>
          </SettingWrapper>
          <SettingWrapper>
            <StyledSectionHeading>
              {formatMessage({ id: 'backup' })}
            </StyledSectionHeading>
            <StyledButton onClick={() => this.setState({ modalVisibility: true, modalType: 'export' })}>
              <Icon type="upload" />
              <Text>{formatMessage({ id: 'export' })}</Text>
            </StyledButton>
            <StyledButton onClick={() => this.setState({ modalVisibility: true, modalType: 'import' })}>
              <Icon type="download" />
              <Text>{formatMessage({ id: 'import' })}</Text>
            </StyledButton>
          </SettingWrapper>
        </Body>
        <Modal
          footer={null}
          width={'40rem'}
          maskClosable
          style={{ marginTop: '1.43rem' }}
          visible={modalVisibility}
          onCancel={() => this.setState({ modalVisibility: false })}
          destroyOnClose
        >
          {modal}
        </Modal>
      </Wrapper>
    );
  }
}

Settings.propTypes = {
  onChangeNetwork: PropTypes.func.isRequired,
  onChangeLocale: PropTypes.func.isRequired,
  onBatchExport: PropTypes.func.isRequired,
  onBatchImport: PropTypes.func.isRequired,
  onDecryptImport: PropTypes.func.isRequired,
  currentNetwork: PropTypes.object.isRequired,
  supportedNetworks: ImmutablePropTypes.map.isRequired,
  locale: PropTypes.string.isRequired,
  intl: PropTypes.object.isRequired,
  restoreContents: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  currentNetwork: makeSelectCurrentNetwork(),
  supportedNetworks: makeSelectSupportedNetworks(),
  locale: makeSelectLocale(),
  restoreContents: makeSelectRestoreContents(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onChangeNetwork: (...args) => dispatch(changeNetwork(...args)),
    onChangeLocale: (...args) => dispatch(changeLocale(...args)),
    onBatchExport: (...args) => dispatch(batchExport(...args)),
    onBatchImport: (...args) => dispatch(batchImport(...args)),
    onDecryptImport: (...args) => dispatch(decryptImport(...args)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(withConnect, injectIntl)(Settings);

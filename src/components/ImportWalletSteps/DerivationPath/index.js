import * as React from 'react';
import PropTypes from 'prop-types';
import { Form, Alert } from 'antd';

import SectionHeading from 'components/ui/SectionHeading';
import Input from 'components/ui/Input';
import { injectIntl } from 'react-intl';

import {
  Tick,
  FormDiv,
  StyledHeading,
  PathWrapper,
  RadioButtonWrapper,
  StyledTable as Table,
  RadioButton,
  StyledRadioGroup as RadioGroup,
  DerivationPathText,
  CustomPathWrapper,
} from './style';


class DerivationPath extends React.Component {
  render() {
    const {
      pathTemplate,
      addresses,
      onChangePathTemplate,
      intl,
      deviceType,
      customPathInput,
      onChangeCustomPath,
      pathValid,
    } = this.props;
    const { formatMessage } = intl;
    const derivationPathTemplates = [
      {
        title: "m/44'/60'/0'/0/{index}",
        subtitle: formatMessage({ id: 'derivation_title_1' }),
        supportedDevices: new Set(['trezor']),
      },
      {
        title: "m/44'/60'/0'/{index}",
        subtitle: formatMessage({ id: 'derivation_title_2' }),
        supportedDevices: new Set(['lns']),
      },
      {
        title: "m/44'/60'/{index}'/0/0",
        subtitle: formatMessage({ id: 'derivation_title_3' }),
        supportedDevices: new Set(['lns']),
      },
    ];

    const columns = [{
      title: formatMessage({ id: 'index' }),
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: formatMessage({ id: 'address' }),
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: formatMessage({ id: 'eth_balance' }),
      dataIndex: 'ethBalance',
      key: 'ethBalance',
    }];
    return (
      <Form onSubmit={this.handleNext}>
        <FormDiv>
          <div>
            <StyledHeading>{formatMessage({ id: 'select_derivation_path' })}</StyledHeading>
            <RadioGroup
              defaultValue={pathTemplate}
              size="small"
              onChange={(e) => e.target.value !== 'Custom path' && onChangePathTemplate(e.target.value)}
            >
              {derivationPathTemplates.map((path) => (
                <RadioButtonWrapper
                  key={path.title}
                  style={!path.supportedDevices.has(deviceType) ? { display: 'none' } : {}}
                >
                  <RadioButton value={path.title}>
                    <Tick type="check" />
                  </RadioButton>
                  <PathWrapper>
                    <DerivationPathText>{path.title}</DerivationPathText>
                    <br />
                    <SectionHeading>{path.subtitle}</SectionHeading>
                  </PathWrapper>
                </RadioButtonWrapper>
            ))}
              <RadioButtonWrapper
                key={'Custom'}
              >
                <RadioButton
                  value={'Custom path'}
                  onClick={() => onChangeCustomPath(customPathInput)}
                >
                  <Tick type="check" />
                </RadioButton>
                <PathWrapper>
                  <DerivationPathText>Custom</DerivationPathText>
                  <CustomPathWrapper>
                    <Input
                      style={{ width: '8rem' }}
                      value={customPathInput}
                      onChange={(e) => onChangeCustomPath(e.target.value)}
                    />
                    {'/{index}'}
                  </CustomPathWrapper>
                </PathWrapper>
              </RadioButtonWrapper>
            </RadioGroup>
          </div>
          {
            pathValid
            ? <div>
              <StyledHeading>
                {formatMessage({ id: 'select_import_address' })}
              </StyledHeading>
              <Table
                onRow={(record) => ({
                  onClick: () => this.props.onSelectAddress(record.index),
                })}
                columns={columns}
                dataSource={addresses}
                size="small"
                style={{ cursor: 'pointer' }}
                pagination={{ onChange: this.props.onChangePage }}
              />
            </div>
            : <Alert
              message={formatMessage({ id: 'invalid_dpath' })}
              type="info"
              showIcon
              style={{ margin: '2rem 0' }}
            />
          }
        </FormDiv>
      </Form>
    );
  }
}

DerivationPath.propTypes = {
  deviceType: PropTypes.string.isRequired,
  pathTemplate: PropTypes.string.isRequired,
  customPathInput: PropTypes.string.isRequired,
  addresses: PropTypes.array.isRequired,
  onChangePathTemplate: PropTypes.func.isRequired,
  onChangeCustomPath: PropTypes.func.isRequired,
  onChangePage: PropTypes.func.isRequired,
  onSelectAddress: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  pathValid: PropTypes.bool.isRequired,
};

export default injectIntl(DerivationPath);

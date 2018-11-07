import * as React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';

import Text from 'components/ui/Text';
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
} from './DerivationPath.style';


class DerivationPath extends React.Component {
  render() {
    const {
      pathTemplate,
      addresses,
      onChangePathTemplate,
      intl,
      deviceType,
    } = this.props;
    const { formatMessage } = intl;
    const derivationPathTemplates = [
      {
        title: "m/44'/60'/0'/0/{index}",
        subtitle: formatMessage({ id: 'derivation_title_1' }),
      },
      {
        title: "m/44'/60'/0'/{index}",
        subtitle: formatMessage({ id: 'derivation_title_2' }),
      },
      {
        title: "m/44'/60'/{index}'/0/0",
        subtitle: formatMessage({ id: 'derivation_title_3' }),
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
              onChange={onChangePathTemplate}
            >
              {derivationPathTemplates.map((path) => (
                <RadioButtonWrapper
                  key={path.title}
                  style={path.title === "m/44'/60'/{index}'/0/0" && deviceType !== 'lns' ? { display: 'none' } : {}}
                >
                  <RadioButton value={path.title}>
                    <Tick type="check" />
                  </RadioButton>
                  <PathWrapper>
                    <DerivationPathText>{path.title}</DerivationPathText>
                    <br />
                    <Text>{path.subtitle}</Text>
                  </PathWrapper>
                </RadioButtonWrapper>
            ))}
            </RadioGroup>
          </div>
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
        </FormDiv>
      </Form>
    );
  }
}

DerivationPath.propTypes = {
  deviceType: PropTypes.string.isRequired,
  pathTemplate: PropTypes.string.isRequired,
  addresses: PropTypes.array.isRequired,
  onChangePathTemplate: PropTypes.func.isRequired,
  onChangePage: PropTypes.func.isRequired,
  onSelectAddress: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(DerivationPath);

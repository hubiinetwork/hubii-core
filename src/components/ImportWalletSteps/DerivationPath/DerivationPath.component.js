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
      pathBase,
      addresses,
      onChangePathBase,
      intl,
    } = this.props;
    const { formatMessage } = intl;
    const derivationPathBases = [
      {
        title: 'm/44\'/60\'/0\'/0',
        subtitle: formatMessage({ id: 'derivation_title_1' }),
      },
      {
        title: 'm/44\'/60\'/0\'',
        subtitle: formatMessage({ id: 'derivation_title_2' }),
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
              defaultValue={pathBase}
              size="small"
              onChange={onChangePathBase}
            >
              {derivationPathBases.map((path) => (
                <RadioButtonWrapper key={path.title}>
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
  pathBase: PropTypes.string.isRequired,
  addresses: PropTypes.array.isRequired,
  onChangePathBase: PropTypes.func.isRequired,
  onChangePage: PropTypes.func.isRequired,
  onSelectAddress: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(DerivationPath);

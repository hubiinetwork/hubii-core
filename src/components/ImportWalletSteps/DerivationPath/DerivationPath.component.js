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
    const {formatMessage} = intl
    const derivationPathBases = [
      {
        title: 'm/44\'/60\'/0\'/0',
        subtitle: formatMessage({id: 'derivation_title_1'}),
      },
      {
        title: 'm/44\'/60\'/0\'',
        subtitle: formatMessage({id: 'derivation_title_2'}),
      },
    ];
    
    const columns = [{
      title: formatMessage({id: 'index'}),
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: formatMessage({id: 'address'}),
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: formatMessage({id: 'eth_balance'}),
      dataIndex: 'ethBalance',
      key: 'ethBalance',
    }];
    return (
      <Form onSubmit={this.handleNext}>
        <FormDiv>
          <div>
            <StyledHeading>{formatMessage({id: 'select_derivation_path'})}</StyledHeading>
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
            {formatMessage({id: 'select_import_address'})}
          </StyledHeading>
          <Table
            onRow={(record) => ({
              onClick: () => this.props.onSelectAddress(record.index),
            })}
            columns={columns}
            dataSource={addresses}
            size="small"
          />
        </FormDiv>
      </Form>
    );
  }
}

DerivationPath.propTypes = {
  /**
   * derivation path base
   */
  pathBase: PropTypes.string.isRequired,

  /**
   * addresses avaliable for selection
   */
  addresses: PropTypes.array.isRequired,

  /**
   * callback when user changes the path base
   */
  onChangePathBase: PropTypes.func.isRequired,

  /**
   * callback when user changes the path base
   */
  onSelectAddress: PropTypes.func.isRequired,
};

export default injectIntl(DerivationPath);

import * as React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';

import Text from 'components/ui/Text';

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

const derivationPathBases = [
  {
    title: 'm/44\'/60\'/0\'/0',
    subtitle: 'hubii core software wallet, Jaxx, Metamask, Exodus, TREZOR (ETH), Digital Bitbox',
  },
  {
    title: 'm/44\'/60\'/0\'',
    subtitle: 'Ledger (ETH)',
  },
];

const columns = [{
  title: 'Index',
  dataIndex: 'index',
  key: 'index',
},
{
  title: 'Address',
  dataIndex: 'address',
  key: 'address',
},
{
  title: 'ETH balance',
  dataIndex: 'ethBalance',
  key: 'ethBalance',
}];

class DerivationPath extends React.Component {
  render() {
    const {
      pathBase,
      addresses,
      onChangePathBase,
    } = this.props;
    return (
      <Form onSubmit={this.handleNext}>
        <FormDiv>
          <div>
            <StyledHeading>Select a root derivation path</StyledHeading>
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
            Select the address you would like to import
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

export default DerivationPath;

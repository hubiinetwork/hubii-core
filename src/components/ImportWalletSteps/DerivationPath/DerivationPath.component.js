import * as React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import {
  Tick,
  Radios,
  FormDiv,
  PathTitle,
  RadioTitle,
  PathWrapper,
  PathSubtitle,
  RadioButtonWrapper,
  StyledTable as Table,
  StyledRadio as RadioButton,
  StyledRadioGroup as RadioGroup,
} from './DerivationPath.style';

const derivationPathBases = [
  {
    title: 'm/44\'/60\'/0\'/0',
    subtitle: 'Hubii Core, Jaxx, Metamask, Exodus, TREZOR (ETH), Digital Bitbox',
  },
  {
    title: 'm/44\'/60\'/0\'',
    subtitle: 'Ledger (ETH)',
  },
  {
    title: 'm/44\'/60\'/160720\'/0\'',
    subtitle: 'Ledger (ETC)',
  },
  {
    title: 'm/44\'/61\'/0\'/0',
    subtitle: 'TREZOR (ETC)',
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
  title: 'ETH Balance',
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
          <Radios>
            <RadioTitle>Select HD derivation path</RadioTitle>
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
                    <PathTitle>{path.title}</PathTitle>
                    <PathSubtitle>{path.subtitle} </PathSubtitle>
                  </PathWrapper>
                </RadioButtonWrapper>
            ))}
            </RadioGroup>
          </Radios>

          <RadioTitle>
            Please select the address you want to interact with
          </RadioTitle>
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

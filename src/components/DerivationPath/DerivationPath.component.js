import * as React from 'react';
import PropTypes from 'prop-types';
import { Icon, Form } from 'antd';
import {
  Between,
  CreateButton,
  LeftArrow,
  Flex,
  SpanText,
  PathTitle,
  PathSubtitle,
  PathWrapper,
  RadioTitle,
  Radios,
  RadioButtonWrapper,
  Tick,
  StyledRadio as RadioButton,
  StyledRadioGroup as RadioGroup,
  FormItem,
  StyledTable as Table,
  Address,
  PreviousAddresses,
} from './DerivationPath.style';
import { ModalFormInput } from '../ui/Modal';
import Open from '../../../public/Images/open-new.svg';
const columns = [
  {
    title: <Address>Your Address</Address>,
    dataIndex: 'address',
  },
  {
    title: 'Balance',
    dataIndex: 'balance',
  },
  {
    title: 'Token Balance',
    dataIndex: 'tokenBalance',
  },
];

class DerivationPath extends React.Component {
  constructor(props) {
    super(props);
    this.state = { path: this.props.paths[3].title, address: '' };
    this.handlePath = this.handlePath.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onGoBack = this.onGoBack.bind(this);
  }
  onGoBack() {
    this.props.onGoBack();
  }

  handleSubmit(e) {
    let data;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        data = { values, path: this.state.path, address: this.state.address };
        this.props.handleSubmit(data);
      }
    });
  }

  handlePath(e) {
    this.setState({ path: e.target.value });
  }

  render() {
    const { walletName, paths, addresses } = this.props;
    const newAddresses = (oldAddresses) => {
      for (let i = 0; i < oldAddresses.length; i += 1) {
        /* eslint-disable no-param-reassign */
        oldAddresses[i].tokenBalance = (
          <img
            style={{ width: 14, height: 14, marginLeft: 35 }}
            src={Open}
            alt="tokenBalance"
          />
        );
      }
      return oldAddresses;
    };
    const { getFieldDecorator } = this.props.form;
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ address: selectedRows[0].address });
        console.log(
          `selectedRowKeys: ${selectedRowKeys}`,
          'selectedRows: ',
          selectedRows
        );
      },
      type: 'radio',
    };

    return (
      <Form onSubmit={this.handleSubmit}>
        <Between>
          <Flex>
            <LeftArrow type="arrow-left" onClick={this.onGoBack} />
            <SpanText>Importing {walletName} Wallet</SpanText>
          </Flex>
          <div>
            <CreateButton>
              <Icon type="plus" />Create new wallet
            </CreateButton>
          </div>
        </Between>

        <Radios>
          <RadioTitle>Select HD deviation path</RadioTitle>
          <RadioGroup
            defaultValue={this.state.path}
            size="small"
            onChange={this.handlePath}
          >
            {paths.map((path) => (
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
            <RadioButtonWrapper>
              <RadioButton value="custom">
                <Tick type="check" />
              </RadioButton>
              <PathWrapper>
                <PathSubtitle>Your Custom Path</PathSubtitle>
                <FormItem colon={false}>
                  {getFieldDecorator('customPath')(<ModalFormInput />)}
                </FormItem>
              </PathWrapper>
            </RadioButtonWrapper>
          </RadioGroup>
        </Radios>

        <div>
          <RadioTitle>
            Please select the address you want to interact with
          </RadioTitle>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={newAddresses(addresses)}
            size="small"
            pagination={false}
          />
        </div>
        <PreviousAddresses type="primary">Previous Addresses</PreviousAddresses>
        <div>
          <PreviousAddresses htmlType="submit">Next</PreviousAddresses>
        </div>
      </Form>
    );
  }
}

DerivationPath.propTypes = {
  /**
   * Name of the wallet.
   */
  walletName: PropTypes.string,
  /**
   * paths in shape of array of object.
   */
  paths: PropTypes.arrayOf(PropTypes.object),
  /**
   * addresses in shape of array of object.
   */
  addresses: PropTypes.arrayOf(PropTypes.object),
  /**
   * callback triggerred when data  is  submitted.
   */
  handleSubmit: PropTypes.func,
  /**
   * callback triggerred when back arrow iss clicked.
   */
  onGoBack: PropTypes.func,
  /**
   * object  of form validation by ant.design.
   */
  form: PropTypes.object,
};

export default Form.create()(DerivationPath);

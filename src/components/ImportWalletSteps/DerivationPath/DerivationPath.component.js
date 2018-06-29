import * as React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import {
  Tick,
  Radios,
  Address,
  FormItem,
  FormDiv,
  ButtonDiv,
  PathTitle,
  RadioTitle,
  StyledSpan,
  PathWrapper,
  PathSubtitle,
  StyledButton,
  StyledBackButton,
  PreviousAddresses,
  RadioButtonWrapper,
  StyledTable as Table,
  StyledRadio as RadioButton,
  StyledRadioGroup as RadioGroup,
} from './DerivationPath.style';
import { ModalFormInput } from '../../ui/Modal';
import Open from '../../../../public/Images/open-new.svg';
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
    this.handleNext = this.handleNext.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }
  handleBack() {
    this.props.handleBack();
  }

  handleNext(e) {
    const { form, handleNext } = this.props;
    let data;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        data = { values, path: this.state.path, address: this.state.address };
        handleNext(data);
      }
    });
  }

  handlePath(e) {
    this.setState({ path: e.target.value });
  }

  render() {
    const { paths, addresses } = this.props;
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
      <Form onSubmit={this.handleNext}>
        <FormDiv>
          <Radios>
            <RadioTitle>Select HD derivation path</RadioTitle>
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
        </FormDiv>
        <ButtonDiv>
          <StyledBackButton type="primary" onClick={this.handleBack}>
            <StyledSpan>Back</StyledSpan>
          </StyledBackButton>
          <StyledButton type={'primary'} htmlType="submit">
            <StyledSpan>Next</StyledSpan>
          </StyledButton>
        </ButtonDiv>
      </Form>
    );
  }
}

DerivationPath.propTypes = {
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
  handleNext: PropTypes.func,
  /**
   * callback triggerred when back arrow iss clicked.
   */
  handleBack: PropTypes.func,
  /**
   * object  of form validation by ant.design.
   */
  form: PropTypes.object,
};

export default Form.create()(DerivationPath);

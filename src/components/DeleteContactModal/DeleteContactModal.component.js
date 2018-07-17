/**
 *
 * Delete Contact Modal
 *
 *
 */
import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import { getAbsolutePath } from 'utils/electron';
import {
  LogoWrapper,
  StyledSelect,
  StyledButton,
  ButtonWrapper,
  StyledForm,
} from './DeleteContactModal.style';
import { ModalFormLabel, ModalFormItem } from '../ui/Modal';

const { Option } = Select;

class DeleteContactModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currContactAddress: '',
      currContactName: '',
      initialDisable: true,
    };
    this.onSelectName = this.onSelectName.bind(this);
    this.onSelectAddress = this.onSelectAddress.bind(this);
  }

  onSelectName(name) {
    this.setState({
      currContactName: name,
      initialDisable: false,
      currContactAddress: '',
    });
  }

  onSelectAddress(address) {
    this.setState({
      currContactAddress: address,
    });
  }

  render() {
    const { contacts, onDelete } = this.props;
    const { currContactName, currContactAddress } = this.state;

    return (
      <div>
        <LogoWrapper>
          <img src={getAbsolutePath('public/images/striim-logo.png')} alt="Striim  logo" />
        </LogoWrapper>
        <StyledForm>

          <ModalFormItem
            colon={false}
            label={<ModalFormLabel>Choose Contact</ModalFormLabel>}
          >

            <StyledSelect
              onChange={(name) => this.onSelectName(name)}
              showSearch
              filterOption={(input, option) => (option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0)}
              optionFilterProp="children"
            >
              { [...new Set(contacts.map((item) => item.name))].map((item) => (
                <Option value={item} key={item}>
                  {item}
                </Option>
                ))}
            </StyledSelect>
          </ModalFormItem>
          <ModalFormItem
            colon={false}
            label={<ModalFormLabel>Choose Address</ModalFormLabel>}
          >
            <StyledSelect
              onChange={(address) => this.onSelectAddress(address)}
              disabled={this.state.initialDisable}
              showSearch
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              value={currContactAddress}
            >
              {contacts.filter((item) => item.name === currContactName).map((contact) => (
                <Option value={contact.address.toLowerCase()} key={contact.address}>
                  {contact.address}
                </Option>
                ))}
            </StyledSelect>
          </ModalFormItem>
          <ButtonWrapper>
            <StyledButton
              type="primary"
              onClick={() => onDelete({ name: currContactName, address: currContactAddress })}
            >
              Delete
            </StyledButton>
          </ButtonWrapper>
        </StyledForm>
      </div>
    );
  }
}

export default DeleteContactModal;
DeleteContactModal.propTypes = {
  contacts: PropTypes.arrayOf(PropTypes.object).isRequired,
  onDelete: PropTypes.func.isRequired,
};

import { List } from 'antd';
import * as React from 'react';
import PropTypes from 'prop-types';
import CopyToClipboard from 'react-copy-to-clipboard';
import ContactDeletionModal from 'components/ContactDeletionModal';
import EditContactModal from 'components/EditContactModal';

import StyledButton from '../ui/Button';
import { Modal } from '../ui/Modal';
import Notification from '../Notification';
import { StyledDiv, StyledList } from './ContactList.style';

/**
 * The ContactList Component shows list of contacts.
 */
export default class ContactList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      name: '',
      address: '',
      modalType: null,
    };
    this.showNotification = this.showNotification.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.validateEdit = this.validateEdit.bind(this);
  }

  onChange(input, type) {
    this.setState({
      [type]: input,
    });
  }

  showNotification() {
    const success = true;
    const message = 'Address copied to clipboard.';
    Notification(success, message);
  }

  showModal(item, modalType) {
    this.setState({
      visible: true,
      name: item.name,
      address: item.address,
      modalType,
    });
  }

  handleCancel() {
    this.setState({
      visible: false,
    });
  }

  handleDelete() {
    const { name, address } = this.state;
    this.setState({ visible: false });
    this.props.onDelete({ name, address });
  }

  validateEdit(address, oldAddress) {
    const { data } = this.props;
    const sameAddressList = data.filter((person) => person.address === address);
    // can implement function to do additional validation
    return !!(sameAddressList.length && address !== oldAddress);
  }

  handleEdit(oldContact) {
    const { onEdit } = this.props;
    const { name, address } = this.state;
    this.setState({ visible: false });
    onEdit({ name, address }, oldContact);
  }

  render() {
    const { size, layout, data } = this.props;
    const { name, address, modalType } = this.state;
    let modal;
    if (modalType === 'delete') {
      modal = (
        <ContactDeletionModal
          name={name}
          address={address}
          onCancel={this.handleCancel}
          onDelete={this.handleDelete}
        />
      );
    } else {
      modal = (
        <EditContactModal
          name={name}
          address={address}
          onEdit={(e) => this.handleEdit(e)}
          onChange={(input, type) => this.onChange(input, type)}
          validateEdit={(newAddress, oldAddress) => this.validateEdit(newAddress, oldAddress)}
        />
      );
    }
    const Item = (item) => (
      <List.Item
        actions={[
          <StyledButton
            type="primary"
            shape="circle"
            icon="delete"
            size={'small'}
            onClick={() => this.showModal(item, 'delete')}
            key={1}
          />,
          <StyledButton
            type="primary"
            shape="circle"
            icon="edit"
            size={'small'}
            onClick={() => this.showModal(item, 'edit')}
            key={1}
          />,
          <CopyToClipboard text={item.address} key={2}>
            <StyledButton
              type="primary"
              shape="circle"
              icon="copy"
              size={'small'}
              onClick={this.showNotification}
              key={2}
            />
          </CopyToClipboard>,
        ]}
      >
        <List.Item.Meta title={item.name} description={item.address} />
      </List.Item>
    );
    return data.length > 0 ? (
      <div>
        <StyledList
          size={size}
          dataSource={data}
          renderItem={Item}
          itemLayout={layout}
        />
        <Modal
          footer={null}
          width={'585px'}
          maskClosable
          maskStyle={{ background: 'rgba(232,237,239,.65)' }}
          style={{ marginTop: '20px' }}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          destroyOnClose
        >
          {modal}
        </Modal>
      </div>
    ) : (
      <StyledDiv>{this.props.message}</StyledDiv>
    );
  }
}

ContactList.defaultProps = {
  size: 'small',
  layout: 'horizontal',
  message: 'There are no contacts added yet.',
};

ContactList.propTypes = {
  /**
   * Array of contacts whose list is to be shown.
   */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * Antd prop layout of list
   */
  layout: PropTypes.string,
  /**
   * Message to shown if list is empty
   */
  message: PropTypes.string,
  /**
   * size of antd list component
   */
  size: PropTypes.oneOf(['default', 'small', 'large']),
  /** Function to be executed when edit button of modal is pressed */
  onEdit: PropTypes.func,
  /** Function to be executed when delete button of modal is pressed */
  onDelete: PropTypes.func,
};

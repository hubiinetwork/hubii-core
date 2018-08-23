import { List } from 'antd';
import * as React from 'react';
import PropTypes from 'prop-types';
import CopyToClipboard from 'react-copy-to-clipboard';
import DeletionModal from 'components/DeletionModal';
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
      modalVisibility: false,
      oldName: '',
      oldAddress: '',
      modalType: null,
    };
    this.showNotification = this.showNotification.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
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
      modalVisibility: true,
      oldName: item.name,
      oldAddress: item.address,
      modalType,
    });
  }

  handleCancel() {
    this.setState({
      modalVisibility: false,
    });
  }

  handleDelete() {
    const { oldName, oldAddress } = this.state;
    this.setState({ modalVisibility: false });
    this.props.onDelete({ name: oldName, address: oldAddress });
  }

  handleEdit(newContact) {
    const { onEdit } = this.props;
    const { oldAddress, oldName } = this.state;
    this.setState({ modalVisibility: false });
    onEdit(newContact, { address: oldAddress, name: oldName });
  }

  render() {
    const { size, layout, data } = this.props;
    const { oldName, oldAddress, modalType } = this.state;
    let modal;
    if (modalType === 'delete') {
      modal = (
        <DeletionModal
          name={oldName}
          address={oldAddress}
          onCancel={this.handleCancel}
          onDelete={this.handleDelete}
          type="contact"
        />
      );
    } else {
      modal = (
        <EditContactModal
          name={oldName}
          address={oldAddress}
          onEdit={(e) => this.handleEdit(e)}
          contacts={data}
          confirmText="Edit Contact"
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
          />,
          <StyledButton
            type="primary"
            shape="circle"
            icon="edit"
            size={'small'}
            onClick={() => this.showModal(item, 'edit')}
          />,
          <CopyToClipboard text={item.address} key={2}>
            <StyledButton
              type="primary"
              shape="circle"
              icon="copy"
              size={'small'}
              onClick={this.showNotification}
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
          width={'41.79rem'}
          maskClosable
          maskStyle={{ background: 'rgba(232,237,239,.65)' }}
          style={{ marginTop: '1.43rem' }}
          visible={this.state.modalVisibility}
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
  message: 'You have not added any contacts.',
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
  /**
   * Function to be executed when edit button of modal is pressed
   */
  onEdit: PropTypes.func.isRequired,
  /**
   * Function to be executed when delete button of modal is pressed
   */
  onDelete: PropTypes.func.isRequired,
};

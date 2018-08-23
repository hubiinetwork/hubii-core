import { List } from 'antd';
import * as React from 'react';
import PropTypes from 'prop-types';
import CopyToClipboard from 'react-copy-to-clipboard';
import DeletionModal from 'components/DeletionModal';
import PlaceholderText from 'components/ui/PlaceholderText';
import EditContactModal from 'components/EditContactModal';

import StyledButton from '../ui/Button';
import { Modal } from '../ui/Modal';
import Notification from '../Notification';
import { StyledList } from './ContactList.style';

/**
 * The ContactList Component shows list of contacts.
 */
export default class ContactList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisibility: false,
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
  }

  onChange(input, type) {
    this.setState({
      [type]: input,
    });
  }

  showNotification() {
    const success = true;
    const message = 'Address copied to clipboard';
    Notification(success, message);
  }

  showModal(item, modalType) {
    this.setState({
      modalVisibility: true,
      name: item.name,
      address: item.address,
      modalType,
    });
  }

  handleCancel() {
    this.setState({
      modalVisibility: false,
    });
  }

  handleDelete() {
    const { name, address } = this.state;
    this.setState({ modalVisibility: false });
    this.props.onDelete({ name, address });
  }

  handleEdit(oldContact) {
    const { onEdit } = this.props;
    const { name, address } = this.state;
    this.setState({ modalVisibility: false });
    onEdit({ name, address }, oldContact);
  }

  render() {
    const { empty, size, layout, data } = this.props;
    const { name, address, modalType } = this.state;
    let modal;
    if (modalType === 'delete') {
      modal = (
        <DeletionModal
          name={name}
          address={address}
          onCancel={this.handleCancel}
          onDelete={this.handleDelete}
          type="contact"
        />
      );
    } else {
      modal = (
        <EditContactModal
          name={name}
          address={address}
          onEdit={(e) => this.handleEdit(e)}
          onChange={(input, type) => this.onChange(input, type)}
          contacts={data}
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
    return (
      <div>
        {
          empty &&
          <PlaceholderText>{this.props.message}</PlaceholderText>
        }
        {
          !empty && data.length === 0 &&
          <PlaceholderText>Filter returned no results</PlaceholderText>
        }
        {
          data.length > 0 &&
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
        }
      </div>
    );
  }
}

ContactList.defaultProps = {
  size: 'small',
  layout: 'horizontal',
  message: "Add a contact by clicking '+ Add a contact' in top right corner",
};

ContactList.propTypes = {
  empty: PropTypes.bool.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  layout: PropTypes.string,
  message: PropTypes.string,
  size: PropTypes.oneOf(['default', 'small', 'large']),
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

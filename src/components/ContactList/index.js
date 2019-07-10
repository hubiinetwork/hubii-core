import { List } from 'antd';
import * as React from 'react';
import PropTypes from 'prop-types';
import CopyToClipboard from 'react-copy-to-clipboard';
import { injectIntl } from 'react-intl';

import DeletionModal from 'components/DeletionModal';
import EditContactModal from 'components/EditContactModal';

import PlaceholderText from 'components/ui/PlaceholderText';
import Button from 'components/ui/Button';
import { Modal } from 'components/ui/Modal';
import Notification from 'components/Notification';
import BlockieAvatar from 'components/BlockieAvatar';

import { StyledList } from './style';

/**
 * The ContactList Component shows list of contacts.
 */
class ContactList extends React.PureComponent {
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
    const { formatMessage } = this.props.intl;
    const success = true;
    const message = formatMessage({ id: 'address_clipboard' });
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
    const { empty, size, layout, data, intl } = this.props;
    const { oldName, oldAddress, modalType } = this.state;
    const { formatMessage } = intl;
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
          initialName={oldName}
          initialAddress={oldAddress}
          onEdit={(e) => this.handleEdit(e)}
          contacts={data}
          confirmText={formatMessage({ id: 'edit_contact' })}
        />
      );
    }
    const Item = (item) => (
      <List.Item
        actions={[
          <Button
            type="icon"
            icon="delete"
            size={'small'}
            onClick={() => this.showModal(item, 'delete')}
          />,
          <Button
            type="icon"
            icon="edit"
            size={'small'}
            onClick={() => this.showModal(item, 'edit')}
          />,
          <CopyToClipboard text={item.address} key={2}>
            <Button
              type="icon"
              icon="copy"
              size={'small'}
              onClick={this.showNotification}
            />
          </CopyToClipboard>,
        ]}
      >
        <List.Item.Meta
          avatar={<BlockieAvatar style={{ width: '2.5rem' }} address={item.address} />}
          title={item.name}
          description={item.address}
        />
      </List.Item>
    );
    return (
      <div>
        {
          empty &&
          <PlaceholderText>{formatMessage({ id: 'add_contact_tip' })}</PlaceholderText>
        }
        {
          !empty && data.length === 0 &&
          <PlaceholderText>{formatMessage({ id: 'contact_filter_no_results' })}</PlaceholderText>
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
};

ContactList.propTypes = {
  empty: PropTypes.bool.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  layout: PropTypes.string,
  size: PropTypes.oneOf(['default', 'small', 'large']),
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  intl: PropTypes.object,
};

export default injectIntl(ContactList);

import { List } from 'antd';
import * as React from 'react';
import PropTypes from 'prop-types';
import StyledButton from '../ui/Button';
import { StyledDiv, StyledList } from './ContactList.style';
import Notification from '../Notification';
import { Modal } from '../ui/Modal';
import EditContactModal from '../EditContactModal';
import CopyToClipboard from 'react-copy-to-clipboard';

/** The props of ContactList Component
 * @param {object[]} props.data contact list to populate.
 * @param {default" | "small" | "large} [props.size="small"] enum of the size of List.
 * @param {string} [props.layout="horizontal"] layout direction of the List.
 * @param {string} [props.message="There are no contacts added yet."] message to show when list is empty.
 */

export default class ContactList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      name: '',
      address: ''
    };
  }
  render() {
    const { size, layout, data } = this.props;
    const Item = item => (
      <List.Item
        actions={[
          <StyledButton
            type="primary"
            shape="circle"
            icon="edit"
            size={'small'}
            onClick={() => this.showModal(item)}
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
          </CopyToClipboard>
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
          maskClosable={false}
          maskStyle={{ background: 'rgba(232,237,239,.65)' }}
          style={{ marginTop: '20px' }}
          visible={this.state.visible}
          onCancel={this.handleCancel}
        >
          <EditContactModal
            name={this.state.name}
            address={this.state.address}
          />
        </Modal>
      </div>
    ) : (
      <StyledDiv>{this.props.message}</StyledDiv>
    );
  }
  showNotification = () => {
    const success = true;
    const meassage = 'Address copied to clipboard.';
    Notification(success, meassage);
  };
  showModal = item => {
    this.setState({
      visible: true,
      name: item.name,
      address: item.address
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };
}

ContactList.defaultProps = {
  size: 'small',
  layout: 'horizontal',
  message: 'There are no contacts added yet.'
};

ContactList.propTypes = {
  /**
   * title of the ContactHeader.
   */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * title of the ContactHeader.
   */
  layout: PropTypes.string,
  /**
   * title of the ContactHeader.
   */
  message: PropTypes.string,
  /**
   * title of the ContactHeader.
   */
  size: PropTypes.oneOf(['default', 'small', 'large'])
};

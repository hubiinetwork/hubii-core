import { List } from "antd";
import * as React from "react";
import PropTypes from 'prop-types';
import StyledButton from "../ui/Button";
import {
  StyledDiv,
  StyledList
} from "./ContactList.style";
import Notification from "../Notification";
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
    this.showNotification = this.showNotification.bind(this);
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
            size={"small"}
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
      <StyledList
        size={size}
        dataSource={data}
        renderItem={Item}
        itemLayout={layout}
      />
    ) : (
      <StyledDiv>{this.props.message}</StyledDiv>
    );
  }

 showNotification() {
    const success = true;
    const meassage = 'Address copied to clipboard.';
    Notification(success, meassage);
  }
}

ContactList.defaultProps = {
    size: "small",
    layout: "horizontal",
    message: "There are no contacts added yet."
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
    size: PropTypes.oneOf(['default','small','large']),

};
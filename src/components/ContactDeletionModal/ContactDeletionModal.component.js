import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  TextPrimary,
  Wrapper,
  StyledButton,
  ParentDiv,
  SecondaryHeader,
} from './ContactDeletionModal.style';


/**
 * ContactDeletionModal
 */
const ContactDeletionModal = (props) => (
  <Wrapper>
    <Text> Are you sure you want to delete this contact?</Text>
    <TextPrimary>
      <div>
        <SecondaryHeader>Name </SecondaryHeader> {props.name}
      </div>
      <div>
        <SecondaryHeader>Address </SecondaryHeader>{props.address}
      </div>
    </TextPrimary>
    <ParentDiv>
      <StyledButton type="primary" onClick={props.onDelete} id="delete">
        Delete
      </StyledButton>
      <StyledButton type="primary" onClick={props.onCancel} id="cancel">
        Cancel
      </StyledButton>
    </ParentDiv>
  </Wrapper>
  );
ContactDeletionModal.propTypes = {
  /**
   * Function to perform action when ok button is clicked
   */
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  name: PropTypes.string,
  address: PropTypes.string,
};
export default ContactDeletionModal;

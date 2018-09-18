import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  TextPrimary,
  Wrapper,
  StyledButton,
  ParentDiv,
  SecondaryHeader,
} from './DeletionModal.style';


/**
 * DeletionModal
 */
const DeletionModal = (props) => (
  <Wrapper>
    <Text> Are you sure you want to delete this {props.type}?</Text>
    <TextPrimary>
      <div>
        <SecondaryHeader>Name</SecondaryHeader> {props.name}
      </div>
      <div>
        <SecondaryHeader>Address</SecondaryHeader>{props.address}
      </div>
    </TextPrimary>
    <ParentDiv>
      <StyledButton type="danger" onClick={props.onDelete} id="delete">
        Delete
      </StyledButton>
      <StyledButton type="default" onClick={props.onCancel} id="cancel">
        Cancel
      </StyledButton>
    </ParentDiv>
  </Wrapper>
  );
DeletionModal.propTypes = {
  /**
   * Function to perform action when cancel button is clicked
   */
  onCancel: PropTypes.func,
  /**
   * Function to perform action when delete button is clicked
   */
  onDelete: PropTypes.func,
  /**
   * Name
   */
  name: PropTypes.string,
  /**
   * Address
   */
  address: PropTypes.string,
  /**
   * Type of Deletion (i.e "wallet", "contact")
   */
  type: PropTypes.string.isRequired,
};
export default DeletionModal;

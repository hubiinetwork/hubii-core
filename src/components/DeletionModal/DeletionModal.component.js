import React from 'react';
import PropTypes from 'prop-types';

import Text from 'components/ui/Text';

import {
  TopHeading,
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
    <TopHeading> Are you sure you want to delete this {props.type}?</TopHeading>
    <TextPrimary>
      <div style={{ marginBottom: '0.5rem' }}>
        <SecondaryHeader large>Name</SecondaryHeader>
        <br />
        <Text>{props.name}</Text>
      </div>
      <div>
        <SecondaryHeader large>Address</SecondaryHeader>
        <br />
        <Text>{props.address}</Text>
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

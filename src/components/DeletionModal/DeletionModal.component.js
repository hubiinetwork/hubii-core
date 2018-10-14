import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

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
const DeletionModal = (props) => {
  const { formatMessage } = props.intl;
  return (
    <Wrapper>
      <TopHeading> {formatMessage({ id: 'delete_confirm' }, { type: props.type })}</TopHeading>
      <TextPrimary>
        <div style={{ marginBottom: '0.5rem' }}>
          <SecondaryHeader large>{formatMessage({ id: 'name' })}</SecondaryHeader>
          <br />
          <Text>{props.name}</Text>
        </div>
        <div>
          <SecondaryHeader large>{formatMessage({ id: 'address' })}</SecondaryHeader>
          <br />
          <Text>{props.address}</Text>
        </div>
      </TextPrimary>
      <ParentDiv>
        <StyledButton type="danger" onClick={props.onDelete} id="delete">
          {formatMessage({ id: 'delete' })}
        </StyledButton>
        <StyledButton type="default" onClick={props.onCancel} id="cancel">
          {formatMessage({ id: 'cancel' })}
        </StyledButton>
      </ParentDiv>
    </Wrapper>
  );
};
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
  intl: PropTypes.object,
};
export default injectIntl(DeletionModal);

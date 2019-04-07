import * as React from 'react';
import PropTypes from 'prop-types';
import { Label, Value, Wrapper } from './style';

/** * The props of TransferDescriptionItem Component
 * @param {number} props.label label of the TransferDescriptionItem.
 * @param {string} props.labelSymbol currency symbol of label of the TransferDescriptionItem like ETH.
 * @param {string} props.value value of the key TransferDescriptionItem.
 */

const TransferDescriptionItem = (props) => {
  const { main, subtitle } = props;
  return (
    <Wrapper>
      <Label>
        {main}
      </Label>
      <Value>
        {subtitle}
      </Value>
    </Wrapper>
  );
};

TransferDescriptionItem.propTypes = {
  /**
   * main value displayed in the TransferDescriptionItem
   */
  main: PropTypes.any.isRequired,
  /**
   * subtitle displayed in the TransferDescriptionItem
   */
  subtitle: PropTypes.any.isRequired,
};

export default TransferDescriptionItem;

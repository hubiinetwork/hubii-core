import * as React from 'react';
import PropTypes from 'prop-types';
import { InputSearch } from '../ui/Input';
import { StyledDiv, Wrapper } from './ContactHeader.style';

/*** The props of ContactHeader Component
 * @param {string} [props.title="All Contacts"] title of the ContactHeader component to shown at top the list.
 * @param {string} [props.placeholder="Filter"] placeholder to be shown in the search area.
 * @param {boolean} [props.showSearch=false] whether to show search bar or not.
 */

export default class ContactHeader extends React.PureComponent {
  render() {
    const { title, placeholder, showSearch } = this.props;
    return (
      <StyledDiv>
        {title}
        {showSearch ? (
          <Wrapper>
            <InputSearch placeholder={placeholder} enterButton />
          </Wrapper>
        ) : null}
      </StyledDiv>
    );
  }
}

ContactHeader.defaultProps = {
  title: 'All Contacts',
  placeholder: 'Filter',
  showSearch: false
};

ContactHeader.propTypes = {
  /**
   * title of the ContactHeader.
   */
  title: PropTypes.string,
  /**
   * placeHolder of the search.
   */
  placeholder: PropTypes.string,
  /**
   * show of the search Bar or not.
   */
  showSearch: PropTypes.bool
};

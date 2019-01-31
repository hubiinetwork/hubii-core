import * as React from 'react';
import PropTypes from 'prop-types';
import {
  StyledDiv,
  Wrapper,
  StyledSearch,
} from './style';
import SectionHeading from '../ui/SectionHeading';

/** *
 * The header of contact list component
 */

export default class ContactHeader extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(value) {
    this.props.onChange(value);
  }

  render() {
    const {
      title,
      placeholder,
      showSearch,
    } = this.props;
    return (
      <StyledDiv>
        <SectionHeading>{title}</SectionHeading>
        {showSearch ? (
          <Wrapper>
            <StyledSearch placeholder={placeholder} onChange={(e) => this.onChange(e.target.value)} />
          </Wrapper>
        ) : null}
      </StyledDiv>
    );
  }
}

ContactHeader.defaultProps = {
  placeholder: 'Filter',
  showSearch: false,
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
  showSearch: PropTypes.bool,
  /**
   * Function triggered as text is inputted
   */
  onChange: PropTypes.func.isRequired,
};

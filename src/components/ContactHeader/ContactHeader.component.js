import * as React from 'react';
import PropTypes from 'prop-types';
import {
  StyledDiv,
  Wrapper,
  StyledTabs,
  StyledSearch,
} from './ContactHeader.style';
import { TabPane } from '../ui/StriimTabs';
import { SectionHeading } from '../ui/SectionHeading';

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
      titleTabs,
      onTabChange,
    } = this.props;
    return (
      <StyledDiv>
        <SectionHeading>{title}</SectionHeading>
        {titleTabs && (
          <StyledTabs
            defaultActiveKey={titleTabs[0].title}
            onChange={onTabChange}
          >
            {titleTabs.map(({ title: tabTitle, TabContent }) => (
              <TabPane tab={tabTitle} key={tabTitle} style={{ color: 'white' }}>
                {TabContent}
              </TabPane>
            ))}
          </StyledTabs>
        )}
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
   * Array of objects which contains title of tab and Tabcontent which is react component.
   */
  titleTabs: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      TabContent: PropTypes.node.isRequired,
    }).isRequired
  ),
  /**
   * Function executed when tab is changed
   */
  onTabChange: PropTypes.func,
  /**
   * Function triggered as text is inputted
   */
  onChange: PropTypes.func.isRequired,
};

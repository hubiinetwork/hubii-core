import * as React from 'react';
import PropTypes from 'prop-types';
import {
  StyledDiv,
  Wrapper,
  StyledTabs,
  StyledSearch,
} from './ContactHeader.style';
import { TabPane } from '../ui/StriimTabs';

/** *
 * The header of contact list component
 */

export default class ContactHeader extends React.PureComponent {
  render() {
    const {
      title,
      placeholder,
      showSearch,
      titleTabs,
      onTabChange,
      onSearch,
    } = this.props;
    return (
      <StyledDiv>
        {title}
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
            <StyledSearch placeholder={placeholder} onSearch={onSearch} />
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
   * Function triggered when enter is pressed in search bar
   */
  onSearch: PropTypes.func,
};

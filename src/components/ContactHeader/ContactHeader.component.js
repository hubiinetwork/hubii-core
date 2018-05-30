import * as React from 'react';
import PropTypes from 'prop-types';
import {
  StyledDiv,
  Wrapper,
  StyledTabs,
  StyledSearch
} from './ContactHeader.style';
import { TabPane } from '../ui/StriimTabs';

/*** The props of ContactHeader Component
 * @param {string} [props.title="All Contacts"] title of the ContactHeader component to shown at top the list.
 * @param {string} [props.placeholder="Filter"] placeholder to be shown in the search area.
 * @param {boolean} [props.showSearch=false] whether to show search bar or not.
 */

export default class ContactHeader extends React.PureComponent {
  render() {
    const {
      title,
      placeholder,
      showSearch,
      titleTabs,
      onTabChange
    } = this.props;
    return (
      <StyledDiv>
        {title}
        {titleTabs && (
          <StyledTabs
            defaultActiveKey={titleTabs[0].title}
            onChange={onTabChange}
          >
            {titleTabs.map(({ title, TabContent }) => (
              <TabPane tab={title} key={title} style={{ color: 'white' }}>
                {TabContent}
              </TabPane>
            ))}
          </StyledTabs>
        )}
        {showSearch ? (
          <Wrapper>
            <StyledSearch placeholder={placeholder} />
          </Wrapper>
        ) : null}
      </StyledDiv>
    );
  }
}

ContactHeader.defaultProps = {
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

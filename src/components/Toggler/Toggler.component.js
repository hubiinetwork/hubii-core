import * as React from 'react';
import PropTypes from 'prop-types';
import {
  StyledDiv,
  StyledTabs,
} from './Toggler.style';
import { TabPane } from '../ui/StriimTabs';

/** *
 * The header of contact list component
 */

export default class ContactHeader extends React.PureComponent {
  render() {
    const {
      titleTabs,
      onTabChange,
    } = this.props;
    return (
      <StyledDiv>
        {titleTabs && (
          <StyledTabs
            defaultActiveKey={titleTabs[0].title}
            onChange={onTabChange}
          >
            {titleTabs.map(({ title: tabTitle }) => (
              <TabPane tab={tabTitle} key={tabTitle} style={{ color: 'white' }} />
            ))}
          </StyledTabs>
        )}
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
};

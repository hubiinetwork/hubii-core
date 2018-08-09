import * as React from 'react';
import PropTypes from 'prop-types';
import {
  StyledDiv,
} from './Toggler.style';
import StriimTabs, { TabPane } from '../ui/StriimTabs';

/** *
 * The header of contact list component
 */

export default class Toggler extends React.PureComponent {
  render() {
    const {
      titleTabs,
      onTabChange,
    } = this.props;
    return (
      <StyledDiv style={{ width: '23.57rem' }}>
        {titleTabs && (
          <StriimTabs
            size="large"
            defaultActiveKey={titleTabs[0].title}
            onChange={onTabChange}
          >
            {titleTabs.map(({ title: tabTitle }) => (
              <TabPane tab={tabTitle} key={tabTitle} />
            ))}
          </StriimTabs>
        )}
      </StyledDiv>
    );
  }
}

Toggler.propTypes = {
  /**
   * Array of objects which contains title of tab and Tabcontent which is react component.
   */
  titleTabs: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
    }).isRequired
  ),
  /**
   * Function executed when tab is changed
   */
  onTabChange: PropTypes.func,
};

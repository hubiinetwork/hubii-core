import * as React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * This SvgIcon component takes basic params to draw an SVGIcon.
 */

export default class SvgIcon extends React.PureComponent {
  render() {
    const {
      dPath,
      children,
      color,
      viewBox,
      size,
      hoverColor,
      style,
    } = this.props;
    const SVGIcon = styled.svg`
      transition: all 0.25s ease-in;
      &:hover {
        fill: ${hoverColor || color};
      }
    `;
    return (
      <SVGIcon
        fill={color}
        viewBox={viewBox}
        height={`${size}px`}
        width={`${size}px`}
        style={style}
      >
        {children || <path d={dPath} />}
      </SVGIcon>
    );
  }
}

SvgIcon.defaultProps = {
  viewBox: '0 0 24 24',
  size: 24,
  style: {},
};
SvgIcon.propTypes = {
  /**
   * dPath for single colored svg icon.
   */
  dPath: PropTypes.string,
  /**
   * children for multi-colored svg icon as a group.
   */
  children: PropTypes.node,
  /**
   * viewBox for size adjustments of svg icon (default '0 0 24 24').
   */
  viewBox: PropTypes.string,
  /**
   * color of svg icon (does  not work when children is passed).
   */
  color: PropTypes.string,
  /**
   * color of svg icon when hovered (does  not work when children is passed).
   */
  hoverColor: PropTypes.string,
  /**
   * size of svg icon (default is 24(px).
   */
  size: PropTypes.number,
  /**
   * style  object for svg icon.
   */
  style: PropTypes.object,
};

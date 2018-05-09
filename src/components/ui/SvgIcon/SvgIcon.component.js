import * as React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * The props of SVGIcon Component
 * @param {string} props.dPath dPath for single colored svg icon.
 * @param {Node} props.children children for multi-colored svg icon as a group.
 * @param {string} props.viewBox [props.viewBox="0 0 24 24"] viewBox for size adjustments of svg icon.
 * @param {string} props.color color of svg icon (does  not work when children is passed).
 * @param {string} props.hoverColor color of svg icon when hovered (does  not work when children is passed).
 * @param {number} props.size [props.size=24] size of svg icon.
 * @param {object} props.style  style  object for svg icon.
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
      style
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
        height={size + 'px'}
        width={size + 'px'}
        style={style}
      >
        {children ? children : <path d={dPath} />}
      </SVGIcon>
    );
  }
}

SvgIcon.defaultProps = {
  viewBox: '0 0 24 24',
  size: 24,
  style: {}
};
SvgIcon.propTypes = {
  dPath: PropTypes.string,
  children: PropTypes.node,
  viewBox: PropTypes.string,
  color: PropTypes.string,
  hoverColor: PropTypes.string,
  size: PropTypes.number,
  style: PropTypes.object
};

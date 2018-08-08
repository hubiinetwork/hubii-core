import { css } from 'styled-components';

export function truncate(width) {
  return css`
    width: ${width};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  `;
}

export const sizes = {
  desktop: 86,
  tablet: 71,
  phone: 55,
};

// Iterate through the sizes and create a media template
export const media = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (max-width: ${sizes[label]}rem) {
      ${css(...args)}
    }
  `;
  return acc;
}, {});

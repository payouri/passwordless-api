/* eslint-disable no-nested-ternary */
import styled, { css, CSSProperties } from 'styled-components';

export type SpinnerProps = {
  size?:
    | 'small'
    | 'medium'
    | 'large'
    | 'fit'
    | {
        width: CSSProperties['width'];
        height: CSSProperties['height'];
      };
  ringSize?: CSSProperties['borderWidth'];
};

const getSpinnerSize = ({ size }: { size?: SpinnerProps['size'] }) => {
  if (typeof size === 'object') {
    return css`
      width: ${typeof size.width === 'string' ? size.width : `${size.width}px`};
      height: ${typeof size.height === 'string'
        ? size.height
        : `${size.height}px`};
    `;
  }
  switch (size) {
    case 'small':
      return css`
        width: 1rem;
        height: 1rem;
      `;
    case 'large':
      return css`
        width: 2rem;
        height: 2rem;
      `;
    case 'fit':
      return css`
        height: 100%;
        aspect-ratio: 1;
      `;
    case 'medium':
    default:
      return css`
        width: 1.5rem;
        height: 1.5rem;
      `;
  }
};

const getSpinnerRingSize = ({ ringSize, size }: SpinnerProps) => {
  if (ringSize) {
    return css`
      border-width: ${typeof ringSize === 'string'
        ? ringSize
        : `${ringSize}px`};
    `;
  }
  return css`
    border-width: ${size === 'small'
      ? '0.125rem'
      : size === 'fit'
      ? '0.125rem'
      : '0.25rem'};
  `;
};

export const SpinnerElement = styled.div<SpinnerProps>`
  border-color: currentColor;
  border-style: solid;
  border-top-color: transparent;
  border-top-style: solid;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  flex: 0 0 auto;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  ${getSpinnerSize}
  ${getSpinnerRingSize}
`;

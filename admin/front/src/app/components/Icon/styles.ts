import styled from 'styled-components';

export const IconWrapper = styled.div<{ iconSize: string }>`
  align-items: center;
  display: flex;
  flex: 0 0 ${({ iconSize }) => iconSize};
  justify-content: center;
  width: ${({ iconSize }) => iconSize};
  height: ${({ iconSize }) => iconSize};
`;

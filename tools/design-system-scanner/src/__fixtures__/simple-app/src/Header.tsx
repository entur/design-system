import React from 'react';
import { PrimaryButton } from '@entur/button';
import { Heading3 } from '@entur/typography';
import styled from 'styled-components';

const StyledButton = styled(PrimaryButton)`
  background-color: hotpink;
`;

export const Header: React.FC = () => {
  return (
    <div>
      <Heading3 style={{ color: 'red' }}>Override heading</Heading3>
      <StyledButton>Styled</StyledButton>
    </div>
  );
};

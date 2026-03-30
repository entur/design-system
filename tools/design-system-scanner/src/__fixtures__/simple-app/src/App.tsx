import React from 'react';
import { PrimaryButton, SecondaryButton } from '@entur/button';
import { Heading1, Paragraph } from '@entur/typography';
import { colors } from '@entur/tokens';

export const App: React.FC = () => {
  return (
    <div>
      <Heading1>Welcome</Heading1>
      <Paragraph>Hello world</Paragraph>
      <PrimaryButton>Click me</PrimaryButton>
      <SecondaryButton>Cancel</SecondaryButton>
    </div>
  );
};

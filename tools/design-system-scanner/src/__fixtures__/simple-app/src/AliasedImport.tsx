import React from 'react';
import { PrimaryButton as MainButton } from '@entur/button';
import { Sidebar } from '@entur/layout/beta';

export const AliasedComponent: React.FC = () => {
  return (
    <div>
      <MainButton>Submit</MainButton>
      <MainButton variant="secondary">Cancel</MainButton>
      <Sidebar>Content</Sidebar>
    </div>
  );
};

import React from 'react';
import { ComponentTokensTable } from '@components/Common/ComponentTokensTable';

type ComponentTokensTableType = {
  title?: string;
  description?: string;
};

type Props = {
  value: ComponentTokensTableType;
  npmPackage?: string;
};

export const ComponentTokensTableResolver = ({ value, npmPackage }: Props) => {
  const { title, description } = value;

  if (!npmPackage) {
    return (
      <div style={{ margin: '1rem 0', color: '#d32f2f' }}>
        <p>NPM package name is required to display component tokens.</p>
      </div>
    );
  }

  return (
    <ComponentTokensTable
      npmPackage={npmPackage}
      title={title}
      description={description}
    />
  );
};

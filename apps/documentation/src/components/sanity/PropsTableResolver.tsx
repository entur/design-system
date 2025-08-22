import React from 'react';
import Props from '@components/Props/Props';

type PropsTableType = {
  componentName: string;
};

type Props = {
  value: PropsTableType;
  npmPackage?: string;
};

export const PropsTableResolver = ({ value, npmPackage }: Props) => {
  const { componentName } = value;
  console.log('PropsTableResolver npmPackage:', npmPackage);

  return <Props componentName={componentName} npmPackage={npmPackage} />;
};

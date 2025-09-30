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
  return <Props componentName={componentName} npmPackage={npmPackage} />;
};

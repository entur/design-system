import React from 'react';
import Props from '@components/Props/Props';

type PropsTableType = {
  componentName: string;
};

type Props = {
  value: PropsTableType;
};

export const PropsTableResolver = ({ value }: Props) => {
  const { componentName } = value;

  return (
    <div style={{ margin: '2rem 0' }}>
      <Props componentName={componentName} />
    </div>
  );
};

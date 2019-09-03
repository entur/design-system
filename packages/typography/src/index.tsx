import React from 'react';

interface Props {
  as?: string | React.ComponentType;
  children: React.ReactChildren;
}

export const PageHeading = ({ as: Element = 'h1', ...rest }: Props) => {
  return <Element {...rest} />;
};

import React from 'react';
import './styles.scss';

export interface Props {
  as?: string | React.ComponentType;
}

export const PageHeading: React.SFC<Props> = ({
  as: Element = 'h1',
  ...rest
}) => {
  return <Element {...rest} />;
};

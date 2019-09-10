import React from 'react';
import './styles.scss';

interface Props {
  as?: string | React.ComponentType;
}

export const PageHeading: React.FC<Props> = ({
  as: Element = 'h1',
  ...rest
}) => {
  return <Element {...rest} />;
};

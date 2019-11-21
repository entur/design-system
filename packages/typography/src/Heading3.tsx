import React from 'react';
import classNames from 'classnames';

export type Heading3Props = {
  /** HTML-elementet eller React-komponenten som rendres */
  as?: string | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children: React.ReactNode;
  [key: string]: any;
};

export const Heading3: React.FC<Heading3Props> = ({
  as: Element = 'h3',
  className,
  ...rest
}) => <Element className={classNames('eds-h3', className)} {...rest} />;

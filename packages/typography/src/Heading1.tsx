import React from 'react';
import classNames from 'classnames';

type Heading1Props = {
  /** HTML-elementet eller React-komponenten som rendres */
  as?: string | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children: React.ReactNode;
  [key: string]: any;
};

export const Heading1: React.FC<Heading1Props> = ({
  as: Element = 'h1',
  className,
  ...rest
}) => <Element className={classNames('eds-h1', className)} {...rest} />;

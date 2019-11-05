import React from 'react';
import classNames from 'classnames';

type Props = {
  /** HTML-elementet eller React-komponenten som rendres */
  as?: string | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children: React.ReactNode;
  [key: string]: any;
};

export const Heading2: React.FC<Props> = ({
  as: Element = 'h2',
  className,
  ...rest
}) => <Element className={classNames('entur-h2', className)} {...rest} />;

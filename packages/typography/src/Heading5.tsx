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

export const Heading5: React.FC<Props> = ({
  as: Element = 'h5',
  className,
  ...rest
}) => <Element className={classNames('entur-h5', className)} {...rest} />;

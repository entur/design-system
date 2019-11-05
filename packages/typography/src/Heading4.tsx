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

export const Heading4: React.FC<Props> = ({
  as: Element = 'h4',
  className,
  ...rest
}) => <Element className={classNames('entur-h4', className)} {...rest} />;

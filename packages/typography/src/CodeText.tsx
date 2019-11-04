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

export const CodeText: React.FC<Props> = ({
  as: Element = 'code',
  className,
  ...rest
}) => (
  <Element className={classNames('entur-code-text', className)} {...rest} />
);

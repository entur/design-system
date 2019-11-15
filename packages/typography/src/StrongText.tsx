import React from 'react';
import classNames from 'classnames';

type StrongTextProps = {
  /** HTML-elementet eller React-komponenten som rendres */
  as?: string | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children: React.ReactNode;
  [key: string]: any;
};

export const StrongText: React.FC<StrongTextProps> = ({
  as: Element = 'strong',
  className,
  ...rest
}) => (
  <Element className={classNames('eds-strong-text', className)} {...rest} />
);

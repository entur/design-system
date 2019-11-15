import React from 'react';
import classNames from 'classnames';

type LinkProps = {
  /** HTML-elementet eller React-komponenten som rendres */
  as?: string | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children: React.ReactNode;
  [key: string]: any;
};

export const Link: React.FC<LinkProps> = ({
  as: Element = 'a',
  className,
  ...rest
}) => <Element className={classNames('eds-link', className)} {...rest} />;

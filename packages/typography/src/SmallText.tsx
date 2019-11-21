import React from 'react';
import classNames from 'classnames';

export type SmallTextProps = {
  /** HTML-elementet eller React-komponenten som rendres */
  as?: string | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children: React.ReactNode;
  [key: string]: any;
};

export const SmallText: React.FC<SmallTextProps> = ({
  as: Element = 'span',
  className,
  ...rest
}) => <Element className={classNames('eds-small-text', className)} {...rest} />;

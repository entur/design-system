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

export const Heading6: React.FC<Props> = ({
  as: Element = 'h6',
  className,
  ...rest
}) => <Element className={classNames('eds-h6', className)} {...rest} />;

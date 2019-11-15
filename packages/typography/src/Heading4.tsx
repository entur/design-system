import React from 'react';
import classNames from 'classnames';

type Heading4Props = {
  /** HTML-elementet eller React-komponenten som rendres */
  as?: string | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children: React.ReactNode;
  [key: string]: any;
};

export const Heading4: React.FC<Heading4Props> = ({
  as: Element = 'h4',
  className,
  ...rest
}) => <Element className={classNames('eds-h4', className)} {...rest} />;

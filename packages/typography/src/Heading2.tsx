import React from 'react';
import classNames from 'classnames';

type Heading2Props = {
  /** HTML-elementet eller React-komponenten som rendres */
  as?: string | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children: React.ReactNode;
  [key: string]: any;
};

export const Heading2: React.FC<Heading2Props> = ({
  as: Element = 'h2',
  className,
  ...rest
}) => <Element className={classNames('eds-h2', className)} {...rest} />;

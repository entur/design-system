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

export const SubLabel: React.FC<Props> = ({
  as: Element = 'span',
  className,
  ...rest
}) => (
  <Element className={classNames('entur-sub-label', className)} {...rest} />
);

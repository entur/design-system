import React from 'react';
import classNames from 'classnames';

export type LabelProps = {
  /** HTML-elementet eller React-komponenten som rendres */
  as?: string | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children: React.ReactNode;
  [key: string]: any;
};

export const Label: React.FC<LabelProps> = ({
  as: Element = 'label',
  className,
  ...rest
}) => <Element className={classNames('eds-label', className)} {...rest} />;

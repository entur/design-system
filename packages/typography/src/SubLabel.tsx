import React from 'react';
import classNames from 'classnames';

type SubLabelProps = {
  /** HTML-elementet eller React-komponenten som rendres */
  as?: string | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children: React.ReactNode;
  [key: string]: any;
};

export const SubLabel: React.FC<SubLabelProps> = ({
  as: Element = 'span',
  className,
  ...rest
}) => <Element className={classNames('eds-sub-label', className)} {...rest} />;

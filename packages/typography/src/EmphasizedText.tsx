import React from 'react';
import classNames from 'classnames';

type EmphasizedTextProps = {
  /** HTML-elementet eller React-komponenten som rendres */
  as?: string | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children: React.ReactNode;
  [key: string]: any;
};

export const EmphasizedText: React.FC<EmphasizedTextProps> = ({
  as: Element = 'em',
  className,
  ...rest
}) => (
  <Element className={classNames('eds-emphasized-text', className)} {...rest} />
);

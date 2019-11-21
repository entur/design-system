import React from 'react';
import classNames from 'classnames';

export type CodeTextProps = {
  /** HTML-elementet eller React-komponenten som rendres */
  as?: string | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children: React.ReactNode;
  [key: string]: any;
};

export const CodeText: React.FC<CodeTextProps> = ({
  as: Element = 'code',
  className,
  ...rest
}) => <Element className={classNames('eds-code-text', className)} {...rest} />;

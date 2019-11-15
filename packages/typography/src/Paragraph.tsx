import React from 'react';
import classNames from 'classnames';

type ParagraphProps = {
  /** HTML-elementet eller React-komponenten som rendres */
  as?: string | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children: React.ReactNode;
  [key: string]: any;
};

export const Paragraph: React.FC<ParagraphProps> = ({
  as: Element = 'p',
  className,
  ...rest
}) => <Element className={classNames('eds-paragraph', className)} {...rest} />;

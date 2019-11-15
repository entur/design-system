import React from 'react';
import classNames from 'classnames';

type SubParagraphProps = {
  /** HTML-elementet eller React-komponenten som rendres */
  as?: string | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children: React.ReactNode;
  [key: string]: any;
};

export const SubParagraph: React.FC<SubParagraphProps> = ({
  as: Element = 'p',
  className,
  ...rest
}) => (
  <Element className={classNames('eds-sub-paragraph', className)} {...rest} />
);

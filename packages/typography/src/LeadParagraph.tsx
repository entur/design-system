import React from 'react';
import classNames from 'classnames';

export type LeadParagraphProps = {
  /** HTML-elementet eller React-komponenten som rendres */
  as?: string | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /** Innholdet */
  children: React.ReactNode;
  [key: string]: any;
};

export const LeadParagraph: React.FC<LeadParagraphProps> = ({
  as: Element = 'p',
  className,
  ...rest
}) => (
  <Element className={classNames('eds-lead-paragraph', className)} {...rest} />
);

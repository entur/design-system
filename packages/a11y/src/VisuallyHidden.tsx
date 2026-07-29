import React from 'react';
import './VisuallyHidden.scss';

export type VisuallyHiddenProps = {
  /** HTML-elementet eller React-komponenten som lager elementet
   * @default "span"
   */
  as?: string | React.ElementType;
  /** Innhold for skjermlesere */
  children: React.ReactNode;
  [key: string]: any;
};

export const VisuallyHidden = ({
  as: Element = 'span',
  children,
  ...rest
}: VisuallyHiddenProps) => (
  <Element className="eds-visually-hidden" {...rest}>
    {children}
  </Element>
);

import React from 'react';
import './VisuallyHidden.scss';

export type VisuallyHiddenProps = {
  /** HTML-elementet eller React-komponenten som lager elementet */
  as: string | React.ElementType;
  /** Innhold for skjermlesere */
  children: React.ReactNode;
};

export const VisuallyHidden: React.FC<VisuallyHiddenProps> = ({
  as: Element = 'span',
  children,
}) => <Element className="eds-visually-hidden">{children}</Element>;

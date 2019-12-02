import React from 'react';
import classNames from 'classnames';
import './BaseCard.scss';

export type CardProps = {
  /** HTML-elementet eller React-komponenten som lager CardBox */
  as?: 'div' | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  [key: string]: any;
};

export const Card: React.FC<CardProps> = ({
  as: Element = 'div',
  children,
  className,
  ...rest
}) => {
  const classList = classNames('eds-base-card', className);
  return (
    <Element className={classList} {...rest}>
      {children}
    </Element>
  );
};

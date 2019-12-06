import React from 'react';
import classNames from 'classnames';
import './BaseCard.scss';

export type BaseCardProps = {
  /** HTML-elementet eller React-komponenten som lager Card
   * @default "div"
   */
  as?: 'div' | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  [key: string]: any;
};

export const BaseCard: React.FC<BaseCardProps> = ({
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

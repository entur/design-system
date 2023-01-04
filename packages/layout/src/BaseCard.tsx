import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentProps } from '@entur/utils';
import './BaseCard.scss';

export type BaseCardOwnProps = {
  /** HTML-elementet eller React-komponenten som lager Card
   * @default "div"
   */
  as?: 'div' | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  children?: React.ReactNode;
};

export type BaseCardProps<T extends React.ElementType = typeof defaultElement> =
  PolymorphicComponentProps<T, BaseCardOwnProps>;

const defaultElement = 'div';

export const BaseCard = <E extends React.ElementType = typeof defaultElement>({
  children,
  className,
  as,
  ...rest
}: BaseCardProps<E>): JSX.Element => {
  const Element: React.ElementType = as || defaultElement;
  const classList = classNames('eds-base-card', className);
  return (
    <Element className={classList} {...rest}>
      {children}
    </Element>
  );
};

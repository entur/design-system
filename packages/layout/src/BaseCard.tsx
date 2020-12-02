import React from 'react';
import classNames from 'classnames';
import { Box, PolymorphicComponentProps } from '@entur/utils';
import './BaseCard.scss';

export type BaseCardOwnProps = {
  /** HTML-elementet eller React-komponenten som lager Card
   * @default "div"
   */
  as?: 'div' | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  [key: string]: any;
};

export type BaseCardProps<
  E extends React.ElementType
> = PolymorphicComponentProps<E, BaseCardOwnProps>;

const defaultElement = 'div';

export const BaseCard = <E extends React.ElementType = typeof defaultElement>({
  children,
  className,
  ...rest
}: BaseCardProps<E>): JSX.Element => {
  const classList = classNames('eds-base-card', className);
  return (
    <Box as={defaultElement} className={classList} {...rest}>
      {children}
    </Box>
  );
};

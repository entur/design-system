import React from 'react';
import classnames from 'classnames';
// import { space } from '@entur/tokens';
import './Grid.scss';

export type GridProps = {
  container?: boolean;
  item?: boolean;
  spacing: 'xs' | 's' | 'm';
  justify?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-around'
    | 'space-between';
  direction?: 'row' | 'column';
  as?: 'div' | React.ElementType;
  children?: React.ReactNode;
  className?: 'string';
  [key: string]: any;
};

// const SPACING = ['extra-small2', 'extra-small', 'small', 'medium', 'large'];

export const Grid: React.FC<GridProps> = ({
  item = false,
  container = false,
  justify = 'flex-start',
  direction = 'row',
  as: Component = 'div',
  children,
  className,
  ...rest
}) => {
  const classList = classnames([
    'eds-grid',
    className,
    { 'eds-grid__item': item },
    { 'eds-grid__container': container },
    { [`eds-grid--justify-${justify}`]: justify !== 'flex-start' },
    {
      [`eds-grid--direction-${direction}`]: direction !== 'row',
    },
  ]);
  return (
    <Component className={classList} {...rest}>
      {children}
    </Component>
  );
};

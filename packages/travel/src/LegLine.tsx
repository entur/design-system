import React from 'react';
import classNames from 'classnames';
import './LegLine.scss';

export type LegLineProps = {
  color: string;
  direction: 'horizontal' | 'vertical';
  pattern: 'line' | 'dashed' | 'dotted' | 'wave';
  className?: string;
};

export const LegLine: React.FC<LegLineProps> = ({
  color,
  direction = 'horizontal',
  pattern,
  className,
  ...rest
}) => {
  return (
    <div
      className={classNames('eds-leg-line', className, {
        [`eds-leg-line--${pattern}`]: pattern,
        [`eds-leg-line--${direction}`]: direction,
      })}
      style={{ backgroundColor: color }}
      {...rest}
    />
  );
};

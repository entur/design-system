import React from 'react';
import classNames from 'classnames';
import './LegLine.scss';

export type LegLineProps = {
  /** Farge på  LegLine'n */
  color: string;
  /** Retningen til LegLine */
  direction: 'horizontal' | 'vertical';
  /** Hvilket linjemønster som skal brukes */
  pattern: 'line' | 'dashed' | 'dotted' | 'wave';
  /** Ekstra klassenavn */
  className?: string;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

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

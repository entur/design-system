import React from 'react';
import classNames from 'classnames';
import { LegLine } from './LegLine';
import './LegBone.scss';

export type LegBoneProps = {
  /** Retning på komponenten */
  direction: 'horizontal' | 'vertical';
  /** Hvilke linjemønster som skal brukes */
  pattern: 'line' | 'dashed' | 'dotted' | 'wave';
  /** Farge på linja */
  color: string;
  /** Farge på startpunktet
   * @default Verdien til color
   */
  startColor?: string;
  /** Farge på endepunktet
   * @default Verdien til color
   */
  endColor?: string;
  /** Vis startpunkt
   * @default true
   */
  showStart?: boolean;
  /** Vis linke
   * @default true
   */
  showLine?: boolean;
  /** Vis endepunkt
   * @default true
   */
  showStop?: boolean;
  /** Ekstra klassenavn */
  className?: string;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export const LegBone: React.FC<LegBoneProps> = ({
  direction,
  pattern,
  color,
  startColor,
  endColor,
  showStart = true,
  showStop = true,
  showLine = true,
  className,
  ...rest
}) => {
  return (
    <div
      className={classNames(className, 'eds-leg-bone', [
        { 'eds-leg-bone--vertical': direction === 'vertical' },
        { 'eds-leg-bone--horizontal': direction === 'horizontal' },
      ])}
      {...rest}
    >
      {showStart && (
        <div
          className={`eds-leg-bone__start`}
          style={{ backgroundColor: startColor || color }}
        />
      )}

      {showLine && (
        <LegLine
          className={`eds-leg-bone__line`}
          direction={direction}
          color={color}
          pattern={pattern}
        />
      )}

      {showStop && (
        <div
          className={`eds-leg-bone__stop`}
          style={{ backgroundColor: endColor || color }}
        />
      )}
    </div>
  );
};

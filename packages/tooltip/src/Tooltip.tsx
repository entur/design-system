import React, { useState } from 'react';
import classNames from 'classnames';
import './styles.scss';

export type Placements =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'left'
  | 'right'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right';
export type TooltipProps = {
  /** Plassering av tooltip-en */
  placement: Placements;
  /** Innholdet i tooltip-boksen */
  content: string;
  /** Elementet som skal ha tooltip-funksjonalitet */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
};
export const Tooltip: React.FC<TooltipProps> = ({
  placement,
  content,
  children,
  className,
  ...rest
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <div
      className="eds-tooltip-wrapper"
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className={classNames(
          'eds-tooltip',
          className,
          `eds-tooltip--${placement}`,
        )}
        role="tooltip"
        aria-hidden={!showTooltip}
        {...rest}
      >
        {content}
      </div>
      <span
        className="eds-tooltip--trigger"
        onMouseOver={() => setShowTooltip(true)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        aria-describedby={content}
      >
        {children}
      </span>
    </div>
  );
};

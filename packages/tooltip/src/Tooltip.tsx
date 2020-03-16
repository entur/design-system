import React, { cloneElement, useState } from 'react';
import { Manager, Reference, Popper } from 'react-popper';
import classNames from 'classnames';
import { useRandomId } from '@entur/utils';
import { Placement } from 'popper.js';

export type TooltipProps = {
  /** Plassering av tooltip-en */
  placement:
    | 'top-left' // top-start
    | 'top'
    | 'top-right' // top-end
    | 'left'
    | 'right'
    | 'bottom-left' // bottom-start
    | 'bottom'
    | 'bottom-right'; // bottom-end
  /** Innholdet i tooltip-boksen */
  content: React.ReactNode;
  /** Elementet som skal ha tooltip-funksjonalitet */
  children: React.ReactElement;
  /** Ekstra klassenavn */
  className?: string;
  [key: string]: any;
};

export const Tooltip: React.FC<TooltipProps> = ({
  placement,
  content,
  children,
  className,
  ...rest
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipId = useRandomId('eds-tooltip');
  console.log(showTooltip);
  if (placement.includes('-')) {
    if (placement.includes('right')) {
      placement.replace('right', 'end');
    }
    if (placement.includes('left')) {
      placement.replace('left', 'start');
    }
  }
  const popperPlacement = placement as Placement;
  return (
    <Manager>
      <Reference>
        {({ ref }) =>
          cloneElement(children, {
            ref: ref,
            onMouseLeave: () => setShowTooltip(false),
            onMouseEnter: () => setShowTooltip(true),
            'aria-describedby': tooltipId,
            onFocus: setShowTooltip(true),
            onBlur: setShowTooltip(false),
          })
        }
      </Reference>
      {true && (
        <Popper
          modifiers={{
            arrow: { enabled: false },
            offset: { offset: '0, 8' },
            // computeStyle: { enabled: false },
            // applyStyle: { enabled: false },
          }}
          placement={popperPlacement}
        >
          {({ ref, style, placement: popperPlacement }) => (
            <div
              className={classNames(
                'eds-tooltip',
                className,
                `eds-tooltip--${popperPlacement}`,
              )}
              ref={ref}
              style={style}
              role="tooltip"
              id={tooltipId}
              data-placement={popperPlacement}
              {...rest}
            >
              {content}
            </div>
          )}
        </Popper>
      )}
    </Manager>
  );
};

import React, { cloneElement, useState } from 'react';
import { Manager, Reference, Popper } from 'react-popper';
import classNames from 'classnames';
import { useRandomId } from '@entur/utils';
import { Placement as PopperPlacementProps } from 'popper.js';
import { CloseIcon } from '@entur/icons';
import { IconButton } from '@entur/button';
import './Tooltip.scss';

export type TooltipProps = {
  /** Plassering av tooltip-en */
  placement:
    | 'top'
    | 'left'
    | 'right'
    | 'bottom-left' // bottom-start
    | 'bottom'
    | 'bottom-right'; // bottom-end
  /** Innholdet i tooltip-boksen */
  content: React.ReactNode;
  /** Elementet som skal ha tooltip-funksjonalitet */
  children: React.ReactElement;
  /** Om tooltipen skal vises */
  isOpen?: boolean;
  /** Ekstra klassenavn for tooltip */
  className?: string;
  [key: string]: any;
};

export const Tooltip: React.FC<TooltipProps> = ({
  placement,
  content,
  children,
  className,
  isOpen = false,
  ...rest
}) => {
  const [showTooltip, setShowTooltip] = useState(isOpen || false);
  const tooltipId = useRandomId('eds-tooltip');
  React.useEffect(() => {
    setShowTooltip(isOpen);
  }, [isOpen]);

  let popperPlacement = placement as PopperPlacementProps;
  if (placement.includes('-')) {
    if (placement.includes('right')) {
      popperPlacement = placement.replace(
        'right',
        'end',
      ) as PopperPlacementProps;
    }
    if (placement.includes('left')) {
      popperPlacement = placement.replace(
        'left',
        'start',
      ) as PopperPlacementProps;
    }
  }

  const childProps: {
    'aria-describedby': string;
    onMouseLeave?: () => void;
    onFocus?: () => void;
    onBlur?: () => void;
    onMouseEnter?: () => void;
  } = {
    'aria-describedby': tooltipId,
  };
  if (!isOpen) {
    childProps.onMouseLeave = () => setShowTooltip(false);
    childProps.onMouseEnter = () => setShowTooltip(true);
    childProps.onFocus = () => setShowTooltip(true);
    childProps.onBlur = () => setShowTooltip(false);
  }

  return (
    <Manager>
      <Reference>
        {({ ref }) =>
          cloneElement(children, {
            ref: ref,
            ...childProps,
          })
        }
      </Reference>
      {showTooltip && (
        <Popper
          modifiers={[
            { name: 'arrow', enabled: false },
            {
              name: 'offset',
              options: { offset: [0, 10] },
            },
          ]}
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
              {isOpen && (
                <IconButton
                  className="eds-tooltip__close-button"
                  onClick={() => setShowTooltip(false)}
                >
                  <CloseIcon />
                </IconButton>
              )}
            </div>
          )}
        </Popper>
      )}
    </Manager>
  );
};

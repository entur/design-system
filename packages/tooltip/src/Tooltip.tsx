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
  /** Åpner ikke tooltip ved hover-events
   * @default false
   */
  disableHoverListener?: boolean;
  /** Åpner ikke tooltip ved focus-events
   * @default false
   */
  disableFocusListener?: boolean;
  /** Viser en lukkeknapp om man kontrollerer åpningen av Tooltip vha `isOpen`
   * @default true
   */
  showCloseButton?: boolean;
  /** Valideringsvariant for Tooltip */
  variant?: 'error';
  [key: string]: any;
};

export const Tooltip: React.FC<TooltipProps> = ({
  placement,
  content,
  children,
  className,
  isOpen = false,
  disableHoverListener = false,
  disableFocusListener = false,
  showCloseButton = true,
  variant,
  ...rest
}) => {
  const [showTooltip, setShowTooltip] = useState(isOpen || false);
  let hoverTimer: NodeJS.Timeout;

  const handleOpen: (event: React.MouseEvent) => void = event => {
    event.persist();
    hoverTimer = setTimeout(() => {
      setShowTooltip(true);
    }, 150);
  };
  React.useEffect(() => {
    return () => {
      clearTimeout(hoverTimer);
    };
  });

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
    'aria-describedby'?: string;
    onMouseLeave?: () => void;
    onFocus?: () => void;
    onBlur?: () => void;
    onMouseEnter?: (e: React.MouseEvent) => void;
  } = {};
  childProps['aria-describedby'] = tooltipId;
  if (!disableFocusListener) {
    childProps.onFocus = () => setShowTooltip(true);
    childProps.onBlur = () => setShowTooltip(false);
  }
  if (!disableHoverListener) {
    childProps.onMouseLeave = () => setShowTooltip(false);
    childProps.onMouseEnter = e => handleOpen(e);
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
                { 'eds-tooltip--error': variant === 'error' },
              )}
              ref={ref}
              style={style}
              role="tooltip"
              id={tooltipId}
              data-placement={popperPlacement}
              {...rest}
            >
              {content}
              {isOpen && showCloseButton && (
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

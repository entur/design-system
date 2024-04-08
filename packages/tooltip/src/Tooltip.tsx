import React, { cloneElement, useState } from 'react';
import { Manager, Reference, Popper } from 'react-popper';
import classNames from 'classnames';
import { useRandomId } from '@entur/utils';
import { Placement as PopperPlacementProps } from '@popperjs/core';
import { CloseIcon } from '@entur/icons';
import { IconButton } from '@entur/button';
import './Tooltip.scss';

type Modifier = {
  name: string;
  enabled?: boolean;
  requires?: Array<string>;
  requiresIfExists?: Array<string>;
  options?: Record<string, unknown>;
  data?: Record<string, unknown>;
  [key: string]: any;
};

/** @deprecated use variant="negative" instead */
const error = 'error';

export type TooltipProps = {
  /** Plassering av tooltip-en */
  placement:
    | 'top'
    | 'top-left'
    | 'top-right'
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
  variant?: 'negative' | typeof error;
  /** En array av modifiers som sendes til Popper, rammeverket som brukes til plassering av Tooltip
   * @default [{ name: 'offset', options: { offset: [0, 10]} }]
   */
  popperModifiers?: Modifier[];
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
  popperModifiers = [
    {
      name: 'offset',
      options: { offset: [0, 10] },
    },
  ],
  ...rest
}) => {
  const [showTooltip, setShowTooltip] = useState(isOpen || false);
  let hoverTimer: ReturnType<typeof setTimeout>;

  const handleOpen: (event: React.MouseEvent) => void = event => {
    event.persist();
    hoverTimer = setTimeout(() => {
      setShowTooltip(true);
    }, 150);
  };
  const onMouseExit: () => void = () => {
    setShowTooltip(false);
    clearTimeout(hoverTimer);
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

  React.useEffect(() => {
    if (!content) {
      setShowTooltip(false);
    }
  }, [content]);

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
    onFocus?: () => void;
    onBlur?: () => void;
    onMouseEnter?: (e: React.MouseEvent) => void;
    onMouseLeave?: () => void;
  } = {};
  childProps['aria-describedby'] = showTooltip ? tooltipId : undefined;

  if (!disableFocusListener) {
    childProps.onFocus = () => setShowTooltip(true);
    childProps.onBlur = () => setShowTooltip(false);
  }
  if (!disableHoverListener) {
    childProps.onMouseEnter = e => handleOpen(e);
    childProps.onMouseLeave = () => onMouseExit();
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
          modifiers={[{ name: 'arrow', enabled: false }, ...popperModifiers]}
          placement={popperPlacement}
        >
          {({ ref, style, placement: popperPlacement }) => (
            <div
              className={classNames(
                'eds-tooltip',
                className,
                `eds-tooltip--${popperPlacement}`,
                {
                  'eds-tooltip--negative':
                    variant === error || variant === 'negative',
                },
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
                  type="button"
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

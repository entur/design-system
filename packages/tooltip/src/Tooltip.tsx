import React, { cloneElement, useEffect, useRef, useState } from 'react';

import classNames from 'classnames';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  arrow,
  limitShift,
} from '@floating-ui/react';

import { useRandomId } from '@entur/utils';
import { CloseIcon } from '@entur/icons';
import { IconButton } from '@entur/button';
import { space, borderRadiuses } from '@entur/tokens';

import { Placement, standardisePlacement } from './utils';

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

type ChildEventListner = {
  'aria-describedby'?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onKeyUp?: (e: React.KeyboardEvent) => void;
  onClick?: (e: React.MouseEvent) => void;
};

/** @deprecated use variant="negative" instead */
const error = 'error';

export type TooltipProps = {
  /** Plassering av tooltip-en */
  placement: Placement;
  /** Innholdet i tooltip-boksen */
  content: React.ReactNode;
  /** Elementet som skal ha tooltip-funksjonalitet */
  children: React.ReactElement;
  /** Om tooltip-en skal vises */
  isOpen?: boolean;
  /** Callback-funksjon for når brukeren trykker på lukk-tooltip-knappen
   * @default () => undefined;
   */
  onClickCloseButton?: () => void;
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
  disableKeyboardListener?: boolean;
  disableClickListner?: boolean;
  /** Viser en lukkeknapp om man kontrollerer åpningen av Tooltip vha `isOpen`
   * @default true
   */
  showCloseButton?: boolean;
  /** Valideringsvariant for Tooltip */
  variant?: 'negative' | typeof error;
  /** For å kontrollere tiden i millisekunder det tar før tooltip-en
   *  vises etter hover, og hvor lang tid det tar før den lukkes etter
   *  hover-slutt.
   *  @default { enter: 150, leave: 300 }
   */
  hoverDelay?: {
    enter?: number;
    leave?: number;
  };
  /** @deprecated Ikke lenger støttet. Meld fra på #talk-designsystem hvis du trenger støtte for
   * overskrivinger av plasseringen til Tooltip!
   */
  popperModifiers?: Modifier[];
  [key: string]: any;
};

export const Tooltip: React.FC<TooltipProps> = ({
  placement,
  content,
  children,
  className,
  isOpen,
  onClickCloseButton = () => undefined,
  disableHoverListener = false,
  disableFocusListener = false,
  disableKeyboardListener = true,
  disableClickListner = true,
  showCloseButton = true,
  variant,
  hoverDelay,
  style,
  ...rest
}) => {
  const [showTooltip, setShowTooltip] = useState(isOpen ?? false);
  const tooltipArrowRef = useRef(null);
  const tooltipId = useRandomId('eds-tooltip');
  const hoverOpenTimer = useRef<ReturnType<typeof setTimeout>>();
  const hoverCloseTimer = useRef<ReturnType<typeof setTimeout>>();

  const isControlled = isOpen !== undefined;

  // calculations for floating-UI tooltip position
  const {
    refs,
    floatingStyles,
    middlewareData,
    placement: actualPlacement,
    isPositioned,
    update,
    elements,
  } = useFloating({
    placement: standardisePlacement(placement),
    open: showTooltip,
    middleware: [
      offset(space.extraSmall),
      flip(),
      shift({ padding: space.extraSmall, limiter: limitShift({ offset: 8 }) }),
      arrow({
        element: tooltipArrowRef,
        padding: borderRadiuses.medium,
      }),
    ],
  });

  // Since we use CSS instead of conditional rendering when hiding tooltip
  // we can't use the whileElementsMounted option and need to handle
  // cleanup ourselves. See https://floating-ui.com/docs/autoupdate
  useEffect(() => {
    if (showTooltip && elements.reference && elements.floating) {
      const cleanup = autoUpdate(elements.reference, elements.floating, update);
      return cleanup;
    }
  }, [showTooltip, elements, update]);

  const onMouseEnter = () => {
    if (isControlled) return;
    clearTimeout(hoverCloseTimer.current);
    hoverOpenTimer.current = setTimeout(() => {
      setShowTooltip(true);
    }, hoverDelay?.enter ?? 150);
  };

  const onMouseLeave = () => {
    if (isControlled) return;
    clearTimeout(hoverOpenTimer.current);
    hoverCloseTimer.current = setTimeout(() => {
      setShowTooltip(false);
    }, hoverDelay?.leave ?? 300);
  };

  React.useEffect(() => {
    return () => {
      clearTimeout(hoverOpenTimer.current);
      clearTimeout(hoverCloseTimer.current);
    };
  }, []);

  React.useEffect(() => {
    if (isOpen !== undefined) setShowTooltip(isOpen);
  }, [isOpen]);

  const referenceListenerProps: ChildEventListner = {
    'aria-describedby': showTooltip ? tooltipId : undefined,
    // focusListner
    ...(!disableFocusListener &&
      !isControlled && { onFocus: () => setShowTooltip(true) }),
    ...(!disableFocusListener &&
      !isControlled && { onBlur: () => setShowTooltip(false) }),
    // hoverListner
    ...(!disableHoverListener && !isControlled && { onMouseEnter }),
    ...(!disableHoverListener && !isControlled && { onMouseLeave }),
    // keyboardListner
    ...(!disableKeyboardListener &&
      !isControlled && {
        onKeyDown: e => {
          if (e.key === 'Escape') setShowTooltip(false);
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            setShowTooltip(!showTooltip);
          }
        },
      }),
    // clickListner
    ...(!disableClickListner &&
      !isControlled && {
        onClick: () => setShowTooltip(!showTooltip),
      }),
  };

  const displayTooltipStyle =
    (!isControlled || isPositioned) && showTooltip && content
      ? undefined
      : 'none';

  return (
    <>
      {cloneElement(children, {
        ref: refs.setReference,
        ...referenceListenerProps,
      })}
      <div
        className={classNames(className, 'eds-tooltip', {
          'eds-tooltip--negative': variant === error || variant === 'negative',
        })}
        ref={refs.setFloating}
        style={{
          ...floatingStyles,
          display: displayTooltipStyle,
          ...style,
        }}
        role="tooltip"
        id={tooltipId}
        onMouseEnter={!disableHoverListener ? onMouseEnter : undefined}
        onMouseLeave={!disableHoverListener ? onMouseLeave : undefined}
        {...rest}
      >
        {content}
        {isOpen && showCloseButton && (
          <IconButton
            className="eds-tooltip__close-button"
            onClick={() => {
              setShowTooltip(false);
              onClickCloseButton();
            }}
            type="button"
            aria-label="Lukk tooltip"
          >
            <CloseIcon aria-hidden="true" />
          </IconButton>
        )}
        <div
          className={`eds-tooltip__arrow--${actualPlacement?.split('-')?.[0]}`}
          ref={tooltipArrowRef}
          style={{
            left: middlewareData.arrow?.x,
            top: middlewareData.arrow?.y,
          }}
        />
      </div>
    </>
  );
};

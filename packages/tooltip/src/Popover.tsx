import React, {
  cloneElement,
  createContext,
  MutableRefObject,
  useContext,
} from 'react';

import classNames from 'classnames';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  limitShift,
} from '@floating-ui/react-dom';

import { Contrast } from '@entur/layout';
import { mergeRefs, useOnClickOutside } from '@entur/utils';
import { space } from '@entur/tokens';

import { Placement, standardisePlacement } from './utils';

import './Popover.scss';

export type PopoverProps = {
  /** Innholdet i Popover */
  children: React.ReactNode;
  /** Plasseringen av Popover
   * @default "bottom-start"
   */
  placement?: Placement;
  /** Hvis du ønsker å styre state selv kan du sende inn state her */
  showPopover?: boolean;
  /** Hvis du ønsker å styre state selv kan du sende inn setState her */
  setShowPopover?: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Popover: React.FC<PopoverProps> = ({
  children,
  placement = 'bottom-start',
  showPopover: controlledState,
  setShowPopover: setControlledState,
}) => {
  const [showPopover, setShowPopover, controlled] = useCustomState(
    controlledState,
    setControlledState,
  );

  // calculations for floating-UI popover position
  const { refs, floatingStyles } = useFloating<HTMLButtonElement>({
    whileElementsMounted: (ref, float, update) =>
      autoUpdate(ref, float, update),
    placement: standardisePlacement(placement),
    middleware: [
      offset(space.extraSmall),
      flip(),
      shift({ padding: space.extraSmall, limiter: limitShift({ offset: 8 }) }),
    ],
  });

  useOnClickOutside([refs.floating, refs.reference], () =>
    setShowPopover(false),
  );

  const popoverTriggerProps = {
    'aria-haspopup': 'dialog',
    'aria-expanded': showPopover,
    ref: refs.setReference,
    type: 'button',
    ...(!controlled && {
      onClick: () => setShowPopover(prev => !prev),
    }),
  };

  const popoverContentProps = {
    role: 'dialog',
    'aria-modal': false,
    'aria-hidden': !showPopover,
    ref: refs.setFloating,
    style: { ...(!showPopover && { display: 'none' }) },
    onKeyDown: (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') setShowPopover(false);
    },
    onBlur: (event: React.FocusEvent) => {
      const elementReceivingFocus = event.relatedTarget as HTMLElement;
      // The check for 'tabindex=-1' is a special case for focus handling in Docz
      if (
        !elementReceivingFocus ||
        elementReceivingFocus.getAttribute('tabindex') === '-1'
      )
        return;
      const focusedElementIsPopover = elementContainsElement(
        refs.floating.current,
        elementReceivingFocus,
      );
      const focusedElementIsTrigger = elementContainsElement(
        refs.reference.current,
        elementReceivingFocus,
      );
      const popoverShouldClose =
        !focusedElementIsPopover && !focusedElementIsTrigger;
      if (showPopover && popoverShouldClose) setShowPopover(false);
    },
  };

  const closeButtonProps = {
    onClick: () => setShowPopover(false),
    type: 'button',
  };

  const contextValue: PopoverContextProps = {
    showPopover,
    floatingStyles,
    popoverTriggerProps,
    popoverContentProps,
    closeButtonProps,
  };

  return (
    <PopoverContext.Provider value={contextValue}>
      {children}
    </PopoverContext.Provider>
  );
};

export type PopoverTriggerProps = {
  /** Knapp som skal brukes for å åpne Popover */
  children: React.ReactElement;
};

export const PopoverTrigger: React.FC<PopoverTriggerProps> = ({ children }) => {
  const { popoverTriggerProps } = usePopoverContext();
  const child = React.Children.only(children) as React.ReactElement<any>;
  return cloneElement(child, popoverTriggerProps);
};

export type PopoverCloseButtonProps = {
  /** En valgfri knapp som kan legges inn for å lukke Popover */
  children: React.ReactElement;
};

export const PopoverCloseButton: React.FC<PopoverCloseButtonProps> = ({
  children,
  ...rest
}) => {
  const { closeButtonProps } = usePopoverContext();
  return cloneElement(children, { ...closeButtonProps, ...rest });
};

export type PopoverContentProps = {
  /**Innholdet til Popover */
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export const PopoverContent = React.forwardRef<
  HTMLDivElement,
  PopoverContentProps
>(({ children, className, style }, ref: React.Ref<HTMLDivElement>) => {
  const { floatingStyles, popoverContentProps } = usePopoverContext();
  return (
    <Contrast
      className={classNames(className, 'eds-popover')}
      {...popoverContentProps}
      style={{ ...floatingStyles, ...popoverContentProps.style, ...style }}
      // @ts-expect-error correct type for floating cannot be set via useFloating
      ref={mergeRefs(popoverContentProps.ref, ref)}
    >
      {children}
    </Contrast>
  );
});

type PopoverContextProps = {
  showPopover: boolean;
  floatingStyles: React.CSSProperties;
  closeButtonProps: Record<string, unknown>;
  popoverContentProps: {
    role: string;
    'aria-modal': boolean;
    'aria-hidden': boolean;
    ref: MutableRefObject<HTMLElement> | ((node: HTMLElement | null) => void);
    style: React.CSSProperties;
    onKeyDown: (event: React.KeyboardEvent) => void;
    onBlur: (event: React.FocusEvent) => void;
  };
  popoverTriggerProps: Record<string, unknown>;
};

const PopoverContext = createContext<PopoverContextProps | undefined>(
  undefined,
);
const usePopoverContext = () => {
  const context = useContext(PopoverContext);
  if (context == null) {
    throw Error('usePopoverContext must be used within <Popover/>');
  }
  return context;
};

const useCustomState = (
  state?: boolean,
  setState?: React.Dispatch<React.SetStateAction<boolean>>,
): [boolean, React.Dispatch<React.SetStateAction<boolean>>, boolean] => {
  const [internalState, setInternalState] = React.useState<boolean>(false);
  const controlled = state !== undefined && setState !== undefined;
  if (controlled) return [state, setState, controlled];
  return [internalState, setInternalState, controlled];
};

function elementContainsElement(
  parent: HTMLElement | null,
  child: HTMLElement,
) {
  if (!parent) return false;
  return parent === child || parent.contains(child);
}

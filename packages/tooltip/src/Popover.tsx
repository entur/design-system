import React, { cloneElement, createContext, useContext } from 'react';
import { usePopper } from 'react-popper';
import { Placement } from '@popperjs/core';
import classNames from 'classnames';
import { Contrast } from '@entur/layout';
import './Popover.scss';

type PopoverContentCallbackProps = {
  ref: React.Ref<HTMLDivElement>;
};

type PopoverContextProps = {
  showPopover: boolean;
  triggerElement?: React.RefObject<HTMLButtonElement>;
  contentElement: React.RefObject<HTMLDivElement>;
  styles: { [key: string]: React.CSSProperties };
  attributes: { [key: string]: { [key: string]: string } | undefined };
  closeButtonProps: Record<string, unknown>;
  popoverContentProps: (
    e: PopoverContentCallbackProps,
  ) => Record<string, unknown>;
  triggerProps: () => Record<string, unknown>;
  [key: string]: any;
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

export type PopoverProps = {
  /** Innholdet i Popover */
  children: React.ReactNode;
  /** Plasseringen av Popover
   * @default "bottom-start"
   */
  placement?: Placement;
};

export const Popover: React.FC<PopoverProps> = ({
  children,
  placement = 'bottom-start',
}) => {
  const [showPopover, setShowPopover] = React.useState(false);
  const triggerElement = React.useRef(null);
  const contentElement = React.useRef(null);

  const { styles, attributes, forceUpdate } = usePopper(
    triggerElement.current,
    contentElement.current,
    {
      modifiers: [
        { name: 'arrow', enabled: false },
        {
          name: 'offset',
          options: {
            offset: [0, 8],
          },
        },
      ],
      placement: placement,
    },
  );

  React.useEffect(() => {
    if (forceUpdate) {
      forceUpdate();
    }
  }, [showPopover, forceUpdate]);

  const triggerProps = React.useCallback(() => {
    const buttonProps = {
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        setShowPopover(prev => !prev);
      },
      'aria-haspopup': 'dialog',
      'aria-expanded': showPopover,
      ref: triggerElement,
    };
    return buttonProps;
  }, [triggerElement, showPopover]);

  useOnClickOutside(contentElement, triggerElement, () =>
    setShowPopover(false),
  );
  const closeButtonProps = {
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      setShowPopover(false);
    },
  };
  const popoverContentProps = React.useCallback(() => {
    const contentProps = {
      role: 'dialog',
      'aria-modal': 'false',
      ref: contentElement,
      onKeyDown: (event: React.KeyboardEvent) => {
        if (event.key === 'Escape') {
          showPopover && setShowPopover(false);
        }
      },
      onBlur: (event: React.FocusEvent) => {
        const elementReceivingFocus = event.relatedTarget as HTMLElement;
        // The check for 'tabindex=-1' is a special case for focus handling in Docz
        if (
          !elementReceivingFocus ||
          elementReceivingFocus.getAttribute('tabindex') === '-1'
        )
          return;
        const focusElementIsPopover = elementContainsElement(
          contentElement.current,
          elementReceivingFocus,
        );
        const focusElementIsTrigger = elementContainsElement(
          triggerElement.current,
          elementReceivingFocus,
        );
        const isValidBlur = !focusElementIsPopover && !focusElementIsTrigger;
        if (showPopover && isValidBlur) setShowPopover(false);
      },
    };
    return contentProps;
  }, [contentElement, showPopover]);
  const contextValue: PopoverContextProps = {
    showPopover,
    triggerElement,
    contentElement,
    styles,
    attributes,
    popoverContentProps,
    closeButtonProps,
    triggerProps,
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
  const { triggerProps } = usePopoverContext();
  const child = React.Children.only(children) as React.ReactElement<any>;
  return cloneElement(child, triggerProps());
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
};

export const PopoverContent = React.forwardRef<
  HTMLDivElement,
  PopoverContentProps
>(({ children }, ref: React.Ref<HTMLDivElement>) => {
  const { showPopover, attributes, styles, popoverContentProps } =
    usePopoverContext();
  const props = popoverContentProps({ ref });
  return (
    <Contrast
      className={classNames(
        'eds-popover',
        {
          'eds-popover--hidden': !showPopover,
        },
        'eds-contrast',
      )}
      style={styles.popper}
      aria-hidden={!showPopover}
      {...attributes.styles}
      {...props}
    >
      {children}
    </Contrast>
  );
});

function elementContainsEventTarget(element: HTMLElement | null, event: Event) {
  if (!element) {
    return false;
  }

  if (element.contains(event.target as Node)) {
    return true;
  }

  // For elements inside a Shadow DOM we need to check the composedPath
  if (event.composed && event.composedPath) {
    const contains = event.composedPath().find(target => {
      if (target === window) {
        return false;
      }
      return element.contains(target as Node);
    });
    return contains ? true : false;
  }

  return false;
}

function elementContainsElement(
  parent: HTMLElement | null,
  child: HTMLElement,
) {
  if (!parent) return false;
  return parent === child || parent.contains(child);
}

function useOnClickOutside(
  ref: React.RefObject<HTMLDivElement>,
  buttonRef: React.RefObject<HTMLButtonElement>,
  handler: () => void,
) {
  React.useEffect(() => {
    const listener = (event: Event) => {
      if (
        elementContainsEventTarget(ref.current, event) ||
        elementContainsEventTarget(buttonRef.current, event)
      ) {
        return;
      }

      handler();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, buttonRef, handler]);
}

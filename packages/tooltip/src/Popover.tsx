import React, { cloneElement, createContext, useContext } from 'react';
import { usePopper } from 'react-popper';
import classNames from 'classnames';
import './Popover.scss';

type PopoverContextProps = {
  showPopover: boolean;
  referenceElement: React.RefObject<HTMLButtonElement>;
  popperElement: React.RefObject<HTMLDivElement>;
  arrowElement: React.RefObject<HTMLDivElement>;
  styles: { [key: string]: React.CSSProperties };
  attributes: { [key: string]: { [key: string]: string } };
  buttonProps: {};
  contentProps: {};
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

type PopoverProps = {
  /** Innholdet i Popover'en */
  children: React.ReactNode;
};

export const Popover: React.FC<PopoverProps> = ({ children }) => {
  const [showPopover, setShowPopover] = React.useState(false);

  const triggerElement = React.useRef(null);
  const contentElement = React.useRef(null);
  const arrowElement = React.useRef(null);
  console.log(contentElement);

  const { styles, attributes } = usePopper(
    triggerElement.current,
    contentElement.current,
    {
      modifiers: [
        { name: 'arrow', options: { element: arrowElement.current } },
        { name: 'placement', options: { placement: 'bottom' } },
        {
          name: 'offset',
          options: {
            offset: [0, 10],
          },
        },
      ],
    },
  );

  const buttonProps = {
    onClick: () => {
      setShowPopover(!showPopover);
      //@ts-ignore
      contentElement.current.focus();
    },
    'aria-haspopup': 'dialog',
    'aria-expanded': showPopover,
  };

  const handleBlur = (event: React.FocusEventHandler<HTMLElement>) => {
    if (
      showPopover &&
      contentElement.current &&
      //@ts-ignore
      !triggerElement.current.contains(event.relatedTarget) &&
      //@ts-ignore
      !contentElement.current.contains(event.relatedTarget)
    ) {
      setShowPopover(false);
    }
  };

  const contentProps = {
    role: 'dialog',
    'aria-modal': 'false',
    onBlur: handleBlur,
    ref: contentElement,
    onKeyDown: (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        showPopover && setShowPopover(false);
      }
    },
  };
  const contextValue = {
    showPopover,
    referenceElement: triggerElement,
    popperElement: contentElement,
    arrowElement: arrowElement,
    styles,
    attributes,
    buttonProps,
    contentProps,
  };
  return (
    <PopoverContext.Provider value={contextValue}>
      {children}
    </PopoverContext.Provider>
  );
};

export const PopoverTrigger: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const { buttonProps, referenceElement } = usePopoverContext();
  return cloneElement(children, { ref: referenceElement, ...buttonProps });
};

export const PopoverContent: React.RefForwardingComponent<
  HTMLDivElement,
  { children: React.ReactNode }
> = React.forwardRef(({ children }, ref: React.Ref<HTMLDivElement>) => {
  const {
    showPopover,
    attributes,
    arrowElement,
    styles,
    contentProps,
  } = usePopoverContext();

  return (
    <div
      className={classNames('eds-popover', {
        'eds-popover--hidden': !showPopover,
      })}
      ref={ref}
      style={styles.popper}
      aria-hidden={!showPopover}
      {...attributes.styles}
      {...contentProps}
    >
      {children}
      <div ref={arrowElement} style={styles.arrow}></div>
    </div>
  );
});

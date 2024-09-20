import React, { cloneElement, useContext, useRef, useState } from 'react';

import classNames from 'classnames';
import {
  autoUpdate,
  flip,
  offset,
  useFloating,
  useInteractions,
  useListItem,
  useListNavigation,
  useTypeahead,
  FloatingList,
  shift,
} from '@floating-ui/react';

import { IconButton } from '@entur/button';
import { VerticalDotsIcon } from '@entur/icons';
import { Placement, standardisePlacement } from '@entur/tooltip';
import { space } from '@entur/tokens';
import { useOnClickOutside, useOnEscape, getNodeText } from '@entur/utils';

import './OverflowMenu.scss';

export type OverflowMenuProps = {
  /** Menypunkter (OverflowMenuItem eller OverflowMenuLink) */
  children: React.ReactNode;
  buttonIcon?: React.ReactNode;
  /** Knapp som skal åpne OverflowMenu
   * @default IconButton med VerticalDotsIcon
   */
  button?: React.ReactElement;
  /** Ekstra klassenavn */
  className?: string;
  /** Posisjoneringen av OverflowMenu-lista
   * @default 'bottom-start'
   */
  placement?: Placement;
  /**
   * @deprecated Use placement insted.
   * This is done to standardise the name of
   * the relative position prop used in Entur
   * designs sytstem components
   */
  position?: 'right' | 'left';
  /** Tekst som beskriver knappen som åpner Overflow-menyen
   * @default "åpne valgmeny"
   */
  'aria-label'?: string;
};

interface SelectContextValue {
  activeIndex: number | null;
  getItemProps: ReturnType<typeof useInteractions>['getItemProps'];
}

const SelectContext = React.createContext<SelectContextValue>(
  {} as SelectContextValue,
);

export const OverflowMenu = ({
  children,
  className,
  button,
  buttonIcon,
  placement = 'bottom-start',
  'aria-label': ariaLabel = 'åpne valgmeny',
  ...rest
}: OverflowMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const listRef = useRef([]);
  const labelsRef = useRef([]);

  const { refs, floatingStyles, context } = useFloating({
    whileElementsMounted: autoUpdate,
    placement: standardisePlacement(
      // check for left is added for backwards compatibility
      rest.position === 'left' ? 'bottom-end' : placement,
    ),
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(space.extraSmall2),
      flip(),
      shift({ padding: space.extraSmall }),
    ],
  });

  const listNav = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
  });

  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    activeIndex,
    onMatch: index => isOpen && setActiveIndex(index),
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [listNav, typeahead],
  );

  const closeMenuAndReturnFocus = () => {
    setIsOpen(false);
    // @ts-expect-error the reference element is actually focusable
    refs.reference.current?.focus?.();
  };

  useOnClickOutside([refs.floating, refs.reference], () => setIsOpen(false));
  useOnEscape(refs.floating, closeMenuAndReturnFocus);
  useOnEscape(refs.reference, closeMenuAndReturnFocus);

  const selectContext = React.useMemo(
    () => ({
      activeIndex,
      getItemProps,
    }),
    [activeIndex, getItemProps],
  );

  const _buttonIcon = buttonIcon ?? <VerticalDotsIcon />;

  return (
    <>
      {!button ? (
        <IconButton
          ref={refs.setReference}
          {...getReferenceProps({
            onClick: () => setIsOpen(!isOpen),
            className,
            'aria-label': ariaLabel,
          })}
          {...rest}
        >
          {_buttonIcon}
        </IconButton>
      ) : (
        cloneElement(button, {
          ref: refs.setReference,
          ...getReferenceProps({
            onClick: () => setIsOpen(!isOpen),
            className,
            'aria-label': ariaLabel,
          }),
          ...rest,
        })
      )}
      <SelectContext.Provider value={selectContext}>
        <div
          ref={refs.setFloating}
          style={{ ...floatingStyles, display: isOpen ? 'initial' : 'none' }}
          {...getFloatingProps({
            className: 'eds-overflow-menu__menu-list',
            role: 'menu',
          })}
        >
          <FloatingList elementsRef={listRef} labelsRef={labelsRef}>
            {children}
          </FloatingList>
        </div>
      </SelectContext.Provider>
    </>
  );
};

export type OverflowMenuItemProps = {
  /** Innholdet til OverflowMenuItem */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** Det som skjer når elementet er valgt, enten ved museklikk eller Enter-klikk */
  onSelect?: () => void;
  /** Lenke til siden brukeren skal sendes til.
   *  Obs: kun én av onSelect og href skal brukes på ett element
   */
  href?: string;
  /** Om dette valget skal være deaktivert */
  disabled?: boolean;
};

export const OverflowMenuItem = ({
  children,
  className,
  onSelect = () => undefined,
  href,
  disabled,
  ...rest
}: OverflowMenuItemProps) => {
  const { activeIndex, getItemProps } = useContext(SelectContext);
  const { ref: listItemRef, index } = useListItem({
    label: !disabled ? getNodeText(children) : null,
  });

  const isHighlighted = activeIndex === index;
  const isLink = href !== undefined;

  const Element = isLink ? 'a' : 'button';

  return (
    <Element
      ref={listItemRef}
      className={classNames(
        'eds-overflow-menu__item',
        {
          'eds-overflow-menu__item--disabled': disabled,
          'eds-overflow-menu__item--highlighted': isHighlighted,
        },
        className,
      )}
      role="menuitem"
      aria-disabled={disabled}
      aria-selected={isHighlighted}
      {...getItemProps({
        onClick: isLink || disabled ? undefined : onSelect,
        href: disabled ? undefined : href,
        tabIndex: isHighlighted ? 0 : -1,
      })}
      {...rest}
    >
      {children}
    </Element>
  );
};

type OverflowMenuLinkExtendedProps = {
  /** @deprecated onSelect is no longer used
   * in OverflowMenuLink, use 'href' instead */
  onSelect?: () => void;
};

export const OverflowMenuLink = ({
  href,
  ...rest
}: Omit<OverflowMenuItemProps, 'onSelect'> & OverflowMenuLinkExtendedProps) => {
  return <OverflowMenuItem href={href} {...rest} />;
};

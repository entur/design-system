import React, { cloneElement } from 'react';
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuLink,
  MenuList,
} from '@reach/menu-button';
import type {
  MenuButtonProps,
  MenuItemProps,
  MenuLinkProps,
} from '@reach/menu-button';
import { IconButton } from '@entur/button';
import { VerticalDotsIcon } from '@entur/icons';
import { Contrast, useContrast } from '@entur/layout';
import classNames from 'classnames';
import type * as Polymorphic from '@reach/utils/polymorphic';
import './OverflowMenu.scss';

export type OverflowMenuProps = {
  /** Menypunkter (OverflowMenuItem eller OverflowMenuLink) */
  children: React.ReactNode;
  /** Knapp som skal åpne OverflowMenu
   * @default IconButton med VerticalDotsIcon
   */
  button?: React.ReactElement;
  /** Ekstra klassenavn */
  className?: string;
  /** Posisjoneringen av OverflowMenu-lista
   * @default 'right'
   */
  position?: 'right' | 'left';
} & MenuButtonProps;

export const OverflowMenu: React.FC<OverflowMenuProps> = ({
  children,
  className,
  button,
  position = 'right',
  ...rest
}) => {
  return (
    <Menu>
      {!button ? (
        <IconButton
          as={MenuButton}
          className={classNames(className, 'eds-overflow-menu__menu-button')}
          {...rest}
        >
          <VerticalDotsIcon />
        </IconButton>
      ) : (
        cloneElement(button, {
          as: MenuButton,
          className: classNames(className, 'eds-overflow-menu__menu-button'),
          ...rest,
        })
      )}
      {useContrast() ? (
        <Contrast
          className={classNames('eds-overflow-menu__menu-list')}
          as={MenuList}
          portal={false}
        >
          {[children]}
        </Contrast>
      ) : (
        <MenuList
          className={classNames('eds-overflow-menu__menu-list', {
            'eds-overflow-menu__menu-list--left': position === 'left',
          })}
          portal={false}
        >
          {[children]}
        </MenuList>
      )}
    </Menu>
  );
};

export type OverflowMenuItemProps = {
  /** Innholdet til OverflowMenuItem */
  children: React.ReactNode;
  /** HTML-elementet eller React-komponenten som lager elementet
   * @default "button"
   */
  as?: 'button' | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /** Det som skjer når elementet er valgt, enten ved museklikk eller Enter-klikk */
  onSelect: () => void;
} & MenuItemProps;

export const OverflowMenuItem = React.forwardRef(
  ({ children, className, onSelect, disabled, as = 'div', ...rest }, ref) => {
    return (
      <MenuItem
        className={classNames(
          'eds-overflow-menu__item',
          { 'eds-overflow-menu__item--disabled': disabled },
          className,
        )}
        onSelect={onSelect}
        disabled={disabled}
        ref={ref}
        as={as}
        {...rest}
      >
        {children}
      </MenuItem>
    );
  },
) as Polymorphic.ForwardRefComponent<'div', OverflowMenuItemProps>;

export type OverflowMenuLinkProps = {
  /** Innholdet til OverflowMenuLink */
  children: React.ReactNode;
  /** HTML-elementet eller React-komponenten som lager elementet
   * @default "a"
   */
  as?: string | React.ReactElement;
  /** Ekstra klassenavn */
  className?: string;
  /** Det som skjer når elementet er valgt, enten ved museklikk eller Enter-klikk */
  onSelect: () => void;
} & MenuLinkProps;

export const OverflowMenuLink = React.forwardRef(
  ({ children, as = 'a', className, onSelect, disabled, ...rest }) => {
    return (
      <MenuLink
        as={as}
        className={classNames(
          'eds-overflow-menu__item',
          { 'eds-overflow-menu__item--disabled': disabled },
          className,
        )}
        onSelect={onSelect}
        disabled={disabled}
        {...rest}
      >
        {children}
      </MenuLink>
    );
  },
) as Polymorphic.ForwardRefComponent<'a', OverflowMenuLinkProps>;

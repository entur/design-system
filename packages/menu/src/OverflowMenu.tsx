import React, { cloneElement } from 'react';
import {
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  MenuLink,
  MenuItemProps,
  MenuLinkProps,
  MenuButtonProps,
} from '@reach/menu-button';
import { IconButton } from '@entur/button';
import { VerticalDotsIcon } from '@entur/icons';
import { Contrast, useContrast } from '@entur/layout';
import classNames from 'classnames';
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
} & MenuButtonProps;

export const OverflowMenu: React.FC<OverflowMenuProps> = ({
  children,
  className,
  button,
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
          className="eds-overflow-menu__menu-list"
          as={MenuList}
          portal={false}
        >
          {[children]}
        </Contrast>
      ) : (
        <MenuList className="eds-overflow-menu__menu-list" portal={false}>
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

export const OverflowMenuItem: React.FC<OverflowMenuItemProps> = ({
  children,
  as = 'button',
  className,
  onSelect,
  disabled,
  ...rest
}) => {
  return (
    <MenuItem
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
    </MenuItem>
  );
};

export type OverflowMenuLinkProps = {
  /** Innholdet til OverflowMenuLink */
  children: React.ReactNode;
  /** HTML-elementet eller React-komponenten som lager elementet
   * @defaul "a"
   */
  as?: 'a' | 'button' | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /** Det som skjer når elementet er valgt, enten ved museklikk eller Enter-klikk */
  onSelect: () => void;
} & MenuLinkProps;

export const OverflowMenuLink: React.FC<OverflowMenuItemProps> = ({
  children,
  as = 'a',
  className,
  onSelect,
  disabled,
  ...rest
}) => {
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
};

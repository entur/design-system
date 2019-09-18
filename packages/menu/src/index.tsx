import React from 'react';
import classNames from 'classnames';
import './styles.scss';

type MenuContextType = {
  activeMenuItem: string | null;
  setActiveMenuItem: (activeMenuItem: string | null) => void;
} | null;
const MenuContext = React.createContext<MenuContextType>(null);

type MenuProviderType = {
  value?: any;
  children: React.ReactChild;
  onItemSelected?: (id: string | null) => void;
};
const MenuProvider: React.FC<MenuProviderType> = ({
  children,
  onItemSelected = () => {},
  ...rest
}) => {
  const isSubMenu = !!React.useContext(MenuContext);
  const [activeMenuItem, setActiveMenuItem] = React.useState<string | null>(
    null,
  );

  if (isSubMenu) {
    return <>{children}</>;
  }

  const updateActiveMenuItem = (item: string | null) => {
    setActiveMenuItem(item);
    onItemSelected(item);
  };

  return (
    <MenuContext.Provider
      value={{ activeMenuItem, setActiveMenuItem: updateActiveMenuItem }}
      {...rest}
    >
      {children}
    </MenuContext.Provider>
  );
};

const useMenu = () => {
  const context = React.useContext(MenuContext);
  if (!context) {
    throw new Error('You need to wrap your MenuItem(s) in a Menu component');
  }
  return context;
};

type MenuItemProps = {
  as: 'a' | 'button' | React.ElementType;
  className?: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => any;
  [key: string]: any;
};

export const MenuItem: React.FC<MenuItemProps> = ({
  as: Element = 'a',
  children,
  className,
  disabled,
  onClick = () => {},
  ...rest
}) => {
  // TODO: Remove this generated ID
  const uniqueId = React.useRef(`${Math.random()}`.substring(2, 10));
  const { activeMenuItem, setActiveMenuItem } = useMenu();
  const isActive = uniqueId.current === activeMenuItem;

  const childrenArray = React.Children.toArray(children);
  const subMenu = childrenArray.find(child => child && child.type === Menu);
  const label = subMenu
    ? childrenArray.filter(child => child && child.type !== Menu)
    : children;

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      return;
    }
    setActiveMenuItem(uniqueId.current);
    onClick(e);
  };

  const ClickTarget = subMenu ? 'button' : Element;

  const ariaProps: any = {};
  if (disabled) {
    ariaProps['aria-disabled'] = true;
  }
  if (subMenu) {
    ariaProps['aria-expanded'] = isActive;
  }

  return (
    <li className={classNames('entur-new-menu__item', className)}>
      <ClickTarget
        className={classNames('entur-new-menu__click-target', {
          'entur-new-menu__click-target--active': isActive,
        })}
        onClick={handleClick}
        {...ariaProps}
        {...rest}
      >
        {label}
      </ClickTarget>
      {isActive && subMenu}
    </li>
  );
};

type MenuProps = {
  className?: string;
  onItemSelected?: () => {};
  size?: 'small' | 'medium';
};

export const Menu: React.FC<MenuProps> = ({
  className,
  children,
  onItemSelected,
  size = 'medium',
  ...rest
}) => {
  return (
    <MenuProvider onItemSelected={onItemSelected}>
      <ul
        className={classNames(
          'entur-new-menu',
          { 'entur-new-menu--small': size === 'small' },
          className,
        )}
        {...rest}
      >
        {children}
      </ul>
    </MenuProvider>
  );
};

import React, { MouseEvent } from 'react';
import classNames from 'classnames';
import './styles.scss';

function isActiveRecursively(child: any): boolean {
  if (!child.props) {
    return false;
  }
  if (child.props.active) {
    return true;
  }
  if (!child.props.children) {
    return false;
  }

  return React.Children.toArray(child.props.children).some(child =>
    isActiveRecursively(child),
  );
}

type MenuItemProps = {
  active?: boolean;
  as?: 'a' | 'button' | React.ElementType;
  className?: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => any;
  [key: string]: any;
};
const RegularMenuItem: React.FC<MenuItemProps> = ({
  active = false,
  as: Element = 'a',
  children,
  className,
  disabled,
  onClick = e => e,
  ...rest
}) => {
  const handleClick = (e: MouseEvent) => {
    if (disabled) {
      return;
    }
    onClick(e);
  };
  return (
    <li className={classNames('entur-menu__item', className)}>
      <Element
        className={classNames('entur-menu__click-target', {
          'entur-menu__click-target--active': active,
        })}
        onClick={handleClick}
        aria-disabled={disabled}
        {...rest}
      >
        {children}
      </Element>
    </li>
  );
};

const MenuItemWithSubMenu: React.FC<MenuItemProps> = ({
  active = false,
  children,
  className,
  disabled,
  onClick = e => e,
  ...rest
}) => {
  const childrenArray = React.Children.toArray(children);
  const subMenu = childrenArray.find(
    (child: any) => child && child.type === Menu,
  );
  const label = childrenArray.filter(
    (child: any) => child && child.type !== Menu,
  );
  const isActiveOrHasActiveDescendents = isActiveRecursively({
    props: { children, active },
  });

  const [isExpanded, setExpanded] = React.useState(
    isActiveOrHasActiveDescendents,
  );

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      return;
    }
    setExpanded(prev => !prev);
    onClick(e);
  };

  return (
    <li className={classNames('entur-menu__item', className)}>
      <button
        className={classNames('entur-menu__click-target', {
          'entur-menu__click-target--active': isActiveOrHasActiveDescendents,
        })}
        onClick={handleClick}
        aria-disabled={disabled}
        aria-expanded={isExpanded}
        {...rest}
      >
        {label}
      </button>
      {isExpanded && subMenu}
    </li>
  );
};

export const MenuItem: React.FC<MenuItemProps> = props => {
  const hasSubMenu = React.Children.toArray(props.children).some(
    (child: any) => child && child.type === Menu,
  );
  return hasSubMenu ? (
    <MenuItemWithSubMenu {...props} />
  ) : (
    <RegularMenuItem {...props} />
  );
};

type MenuProps = {
  className?: string;
  onItemSelected?: (id: string) => void;
  size?: 'small' | 'medium';
};

export const Menu: React.FC<MenuProps> = ({
  className,
  children,
  size = 'medium',
  ...rest
}) => {
  return (
    <ul
      className={classNames(
        'entur-menu',
        { 'entur-menu--small': size === 'small' },
        className,
      )}
      {...rest}
    >
      {children}
    </ul>
  );
};

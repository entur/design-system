import React, { MouseEvent } from 'react';
import classNames from 'classnames';
import { Menu } from './Menu';

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
  /** Om meny-elementet er det som er aktivt */
  active?: boolean;
  /** HTML-elementet eller React-komponenten som rendres */
  as?: 'a' | 'button' | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /** Om meny-elementet er deaktivert */
  disabled?: boolean;
  /** Callback for når man klikker på meny-elementet */
  onClick?: (e: React.MouseEvent) => any;
  /** Sett til true om du vil tvinge alle sub-menus til å rendre barna sine. Typisk for å vise søkeresultater */
  forceExpandSubMenus?: boolean;
  [key: string]: any;
};
const RegularMenuItem: React.FC<MenuItemProps> = ({
  active = false,
  as: Element = 'a',
  children,
  className,
  disabled,
  onClick = e => e,
  forceExpandSubMenus, // This property is ignored
  ...rest
}) => {
  const handleClick = (e: MouseEvent) => {
    if (disabled) {
      return;
    }
    onClick(e);
  };
  const RenderedElement = disabled ? 'button' : Element;
  return (
    <li className={classNames('eds-menu__item', className)}>
      <RenderedElement
        className={classNames('eds-menu__click-target', {
          'eds-menu__click-target--active': active,
        })}
        onClick={handleClick}
        disabled={disabled}
        {...rest}
      >
        {children}
      </RenderedElement>
    </li>
  );
};

const MenuItemWithSubMenu: React.FC<MenuItemProps> = ({
  active = false,
  as, // Ignored. Always overridden to button
  children,
  className,
  disabled,
  forceExpandSubMenus,
  onClick = e => e,
  ...rest
}) => {
  const childrenArray = React.Children.toArray(children);
  const subMenu = childrenArray.find(
    (child: any) => child && child.type === Menu,
  );
  const label = childrenArray.filter((child: any) => child !== subMenu);
  const isActiveOrHasActiveDescendents = isActiveRecursively({
    props: { children, active },
  });

  const [isExpanded, setExpanded] = React.useState(
    forceExpandSubMenus || isActiveOrHasActiveDescendents,
  );

  React.useEffect(() => {
    if (forceExpandSubMenus) {
      setExpanded(true);
    } else {
      setExpanded(isActiveOrHasActiveDescendents);
    }
  }, [forceExpandSubMenus, isActiveOrHasActiveDescendents]);

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      return;
    }
    setExpanded(prev => !prev);
    onClick(e);
  };

  return (
    <li className={classNames('eds-menu__item', className)}>
      <button
        className={classNames('eds-menu__click-target', {
          'eds-menu__click-target--active': isActiveOrHasActiveDescendents,
        })}
        onClick={handleClick}
        disabled={disabled}
        aria-expanded={isExpanded}
        type="button"
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
    (child: any) => child && child.type && child.type.__IS_ENTUR_MENU__,
  );
  return hasSubMenu ? (
    <MenuItemWithSubMenu {...props} />
  ) : (
    <RegularMenuItem {...props} />
  );
};

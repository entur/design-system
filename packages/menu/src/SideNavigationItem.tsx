import React from 'react';
import classNames from 'classnames';

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

type BaseSideNavigationItemProps = {
  active?: boolean;
  as?: 'a' | 'button' | React.ElementType;
  className?: string;
  children: React.ReactNode;
  subMenu?: React.ReactNode;
  [key: string]: any;
};
const BaseSideNavigationItem = React.forwardRef<
  HTMLAnchorElement,
  BaseSideNavigationItemProps
>(
  (
    { className, active = false, as: Element = 'a', subMenu, ...rest },
    ref: React.Ref<HTMLAnchorElement>,
  ) => {
    return (
      <li className={classNames('eds-side-navigation__item', className)}>
        <Element
          className={classNames('eds-side-navigation__click-target', {
            'eds-side-navigation__click-target--active': active,
          })}
          ref={ref}
          {...rest}
        />
        {subMenu}
      </li>
    );
  },
);

type DisabledSideNavigationItemProps = {
  children: React.ReactNode;
  [key: string]: any;
};
const DisabledSideNavigationItem = React.forwardRef<
  HTMLAnchorElement,
  DisabledSideNavigationItemProps
>(({ children, ...rest }, ref: React.Ref<HTMLAnchorElement>) => (
  <BaseSideNavigationItem
    as="button"
    disabled={true}
    aria-disabled={true}
    ref={ref}
    {...rest}
  >
    {children}
  </BaseSideNavigationItem>
));

export type SideNavigationItemProps = {
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
export const SideNavigationItem = React.forwardRef<
  HTMLAnchorElement,
  SideNavigationItemProps
>(
  (
    { active, disabled, children, forceExpandSubMenus, ...rest },
    ref: React.Ref<HTMLAnchorElement>,
  ) => {
    const childrenArray = React.Children.toArray(children);
    const subMenu = childrenArray.find(
      (child: any) => child && child.type && child.type.__IS_ENTUR_MENU__,
    );
    const label = subMenu
      ? childrenArray.filter(child => child !== subMenu)
      : children;

    if (disabled) {
      return (
        <DisabledSideNavigationItem ref={ref} {...rest}>
          {label}
        </DisabledSideNavigationItem>
      );
    }

    if (!subMenu) {
      return (
        <BaseSideNavigationItem active={active} ref={ref} {...rest}>
          {label}
        </BaseSideNavigationItem>
      );
    }

    const isExpanded =
      forceExpandSubMenus ||
      isActiveRecursively({ props: { children, active } });

    return (
      <BaseSideNavigationItem
        active={active}
        subMenu={isExpanded && subMenu}
        aria-expanded={isExpanded}
        ref={ref}
        {...rest}
      >
        {label}
      </BaseSideNavigationItem>
    );
  },
);

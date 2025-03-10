import React from 'react';
import classNames from 'classnames';
import { useSideNavigationContext } from './CollapsibleSideNavigation';
import { useShowDelayedLabel } from './useShowDelayedLabel';
import { PolymorphicComponentProps } from '@entur/utils';

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

type BaseSideNavigationItemOwnProps = {
  active?: boolean;
  as?: 'a' | 'button' | React.ElementType;
  className?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  subMenu?: React.ReactNode;
  [key: string]: any;
};

export type BaseSideNavigationItemProps<
  T extends React.ElementType = typeof defaultElementBaseItem,
> = PolymorphicComponentProps<T, BaseSideNavigationItemOwnProps>;

const defaultElementBaseItem = 'a';

const BaseSideNavigationItem: <
  E extends React.ElementType = typeof defaultElementBaseItem,
>(
  props: BaseSideNavigationItemProps<E>,
) => React.ReactElement | null = React.forwardRef(
  <E extends React.ElementType = typeof defaultElementBaseItem>(
    {
      className,
      active = false,
      subMenu,
      icon,
      children,
      as,
      ...rest
    }: BaseSideNavigationItemProps<E>,
    ref: typeof rest.ref,
  ) => {
    const Element: React.ElementType = as || defaultElementBaseItem;
    const { isCollapsed } = useSideNavigationContext();
    const [showLabel] = useShowDelayedLabel(isCollapsed);
    return (
      <li className={classNames('eds-side-navigation__item', className)}>
        <Element
          className={classNames('eds-side-navigation__click-target', {
            'eds-side-navigation__click-target--active': active,
          })}
          aria-label={isCollapsed ? children : undefined}
          aria-current={active ? 'page' : undefined}
          ref={ref}
          {...rest}
        >
          {icon}
          {showLabel && children}
        </Element>
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
  HTMLButtonElement,
  DisabledSideNavigationItemProps
>(({ children, ...rest }, ref: React.Ref<HTMLButtonElement>) => (
  <BaseSideNavigationItem
    as="button"
    disabled={true}
    aria-disabled={true}
    ref={ref}
    type="button"
    {...rest}
  >
    {children}
  </BaseSideNavigationItem>
));

export type SideNavigationItemOwnProps = {
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
  icon?: React.ReactNode;
  [key: string]: any;
};

export type SideNavigationItemProps<
  T extends React.ElementType = typeof defaultElementItem,
> = PolymorphicComponentProps<T, SideNavigationItemOwnProps>;

const defaultElementItem = 'a';

export const SideNavigationItem: <
  E extends React.ElementType = typeof defaultElementItem,
>(
  props: SideNavigationItemProps<E>,
) => React.ReactElement | null = React.forwardRef(
  <E extends React.ElementType = typeof defaultElementItem>(
    {
      active,
      disabled,
      children,
      forceExpandSubMenus,
      as,
      ...rest
    }: SideNavigationItemProps<E>,
    ref: typeof rest.ref,
  ) => {
    const Element: React.ElementType = as || defaultElementItem;
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
        <BaseSideNavigationItem
          as={Element}
          active={active}
          ref={ref}
          {...rest}
        >
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
        as={Element}
        ref={ref}
        {...rest}
      >
        {label}
      </BaseSideNavigationItem>
    );
  },
);

import React from 'react';
import type { PolymorphicComponentProps } from '@entur/utils';
import classNames from 'classnames';
import { LeftArrowIcon, RightArrowIcon } from '@entur/icons';
import { Flex } from '../Flex';
import { Grid } from '../Grid';
import './Sidebar.scss';

type SidebarOwnProps = {
  /** Toggle contrast styling for the sidebar */
  contrast?: boolean;
  /** Controlled collapsed state. When provided, the sidebar becomes
   * collapsible and a toggle button is rendered. */
  collapsed?: boolean;
  /** Callback when the collapse toggle is clicked */
  onCollapseToggle?: (collapsed: boolean) => void;
  /** aria-label for the toggle button when the sidebar is collapsed
   * @default 'Åpne sidemeny'
   */
  openSidebarAriaLabel?: string;
  /** aria-label for the toggle button when the sidebar is expanded
   * @default 'Lukk sidemeny'
   */
  closeSidebarAriaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
  /** Content of the sidebar */
  children?: React.ReactNode;
};

type SidebarSectionOwnProps = {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

const defaultSidebarElement = 'aside';
const defaultSectionElement = 'div';
const defaultNavigationElement = 'nav';
const defaultFooterElement = 'footer';

export type SidebarProps<
  T extends React.ElementType = typeof defaultSidebarElement,
> = PolymorphicComponentProps<T, SidebarOwnProps>;

export type SidebarSectionProps<
  T extends React.ElementType = typeof defaultSectionElement,
> = PolymorphicComponentProps<T, SidebarSectionOwnProps>;

type SidebarRootComponent = (<
  E extends React.ElementType = typeof defaultSidebarElement,
>(
  props: SidebarProps<E> & { ref?: React.Ref<Element> },
) => React.ReactElement | null) & { displayName?: string };

type SidebarSectionComponent<
  Default extends React.ElementType = typeof defaultSectionElement,
> = (<E extends React.ElementType = Default>(
  props: SidebarSectionProps<E> & { ref?: React.Ref<Element> },
) => React.ReactElement | null) & { displayName?: string };

const SidebarLogo: SidebarSectionComponent = React.forwardRef(
  <E extends React.ElementType = typeof defaultSectionElement>(
    { children, as, ...rest }: SidebarSectionProps<E>,
    ref?: React.Ref<Element>,
  ) => {
    const Element: React.ElementType = as || defaultSectionElement;
    return (
      <Element ref={ref} {...rest}>
        {children}
      </Element>
    );
  },
);

const SidebarUser: SidebarSectionComponent = React.forwardRef(
  <E extends React.ElementType = typeof defaultSectionElement>(
    { children, as, ...rest }: SidebarSectionProps<E>,
    ref?: React.Ref<Element>,
  ) => {
    const Element: React.ElementType = as || defaultSectionElement;
    return (
      <Element ref={ref} {...rest}>
        {children}
      </Element>
    );
  },
);

const SidebarData: SidebarSectionComponent = React.forwardRef(
  <E extends React.ElementType = typeof defaultSectionElement>(
    { children, as, ...rest }: SidebarSectionProps<E>,
    ref?: React.Ref<Element>,
  ) => {
    return (
      // @ts-expect-error generic prop forwarding through polymorphic Flex
      <Flex
        ref={ref}
        as={as || defaultSectionElement}
        direction="column"
        gap="s"
        {...rest}
      >
        {children}
      </Flex>
    );
  },
);

const SidebarNavigation: SidebarSectionComponent<
  typeof defaultNavigationElement
> = React.forwardRef(
  <E extends React.ElementType = typeof defaultNavigationElement>(
    { children, className, as, ...rest }: SidebarSectionProps<E>,
    ref?: React.Ref<Element>,
  ) => {
    const Element: React.ElementType = as || defaultNavigationElement;
    return (
      <Element
        ref={ref}
        className={classNames(
          'eds-layout-template-sidebar__navigation',
          className,
        )}
        {...rest}
      >
        {children}
      </Element>
    );
  },
);

const SidebarFooter: SidebarSectionComponent<typeof defaultFooterElement> =
  React.forwardRef(
    <E extends React.ElementType = typeof defaultFooterElement>(
      { children, className, as, ...rest }: SidebarSectionProps<E>,
      ref?: React.Ref<Element>,
    ) => {
      const Element: React.ElementType = as || defaultFooterElement;
      return (
        <Element
          ref={ref}
          className={classNames(
            'eds-layout-template-sidebar__footer',
            className,
          )}
          {...rest}
        >
          {children}
        </Element>
      );
    },
  );

const CollapseToggle = ({
  isCollapsed,
  onToggle,
  openLabel,
  closeLabel,
}: {
  isCollapsed: boolean;
  onToggle: () => void;
  openLabel: string;
  closeLabel: string;
}) => (
  <button
    type="button"
    className="eds-layout-template-sidebar__collapse-toggle"
    onClick={onToggle}
    aria-expanded={!isCollapsed}
    aria-label={isCollapsed ? openLabel : closeLabel}
  >
    {isCollapsed ? <RightArrowIcon size={16} /> : <LeftArrowIcon size={16} />}
  </button>
);

const SidebarRoot: SidebarRootComponent = React.forwardRef(
  <E extends React.ElementType = typeof defaultSidebarElement>(
    {
      children,
      className,
      style,
      contrast = true,
      collapsed,
      onCollapseToggle,
      openSidebarAriaLabel = 'Åpne sidemeny',
      closeSidebarAriaLabel = 'Lukk sidemeny',
      as,
      ...rest
    }: SidebarProps<E>,
    ref?: React.Ref<Element>,
  ) => {
    const collapsible = collapsed !== undefined;
    const isCollapsed = collapsed ?? false;

    const sidebarClassNames = classNames(
      'eds-layout-template-sidebar',
      {
        'eds-layout-template-sidebar--plain': !contrast,
        'eds-layout-template-sidebar--collapsible': collapsible,
        'eds-layout-template-sidebar--collapsed': collapsible && isCollapsed,
      },
      className,
    );

    const wrapperClassNames = classNames(
      'eds-layout-template-sidebar-wrapper',
      {
        'eds-contrast': contrast,
        'eds-layout-template-sidebar-wrapper--collapsible': collapsible,
      },
    );

    if (!collapsible) {
      return (
        <Grid.Item className={wrapperClassNames} colSpan="1 / 2">
          {
            // @ts-expect-error generic prop forwarding through polymorphic Flex
            <Flex
              ref={ref}
              as={as || defaultSidebarElement}
              direction="column"
              gap="m"
              className={sidebarClassNames}
              style={style}
              {...rest}
            >
              {children}
            </Flex>
          }
        </Grid.Item>
      );
    }

    const collapsedStyle = isCollapsed
      ? ({ ...style, '--eds-sidebar-width': '2rem' } as React.CSSProperties)
      : style;

    return (
      <Grid.Item className={wrapperClassNames} colSpan="1 / 2">
        {
          // @ts-expect-error generic prop forwarding through polymorphic Flex
          <Flex
            ref={ref}
            as={as || defaultSidebarElement}
            direction="column"
            gap="m"
            className={sidebarClassNames}
            style={collapsedStyle}
            {...rest}
          >
            <div className="eds-layout-template-sidebar__content">
              {children}
            </div>
          </Flex>
        }
        {onCollapseToggle && (
          <CollapseToggle
            isCollapsed={isCollapsed}
            onToggle={() => onCollapseToggle(!isCollapsed)}
            openLabel={openSidebarAriaLabel}
            closeLabel={closeSidebarAriaLabel}
          />
        )}
      </Grid.Item>
    );
  },
);

export type SidebarComponent = typeof SidebarRoot & {
  Logo: typeof SidebarLogo;
  User: typeof SidebarUser;
  Data: typeof SidebarData;
  Navigation: typeof SidebarNavigation;
  Footer: typeof SidebarFooter;
};

export const Sidebar: SidebarComponent = Object.assign(SidebarRoot, {
  Logo: SidebarLogo,
  User: SidebarUser,
  Data: SidebarData,
  Navigation: SidebarNavigation,
  Footer: SidebarFooter,
});

Sidebar.displayName = 'Template.Portal.Sidebar';
Sidebar.Logo.displayName = 'Template.Portal.Sidebar.Logo';
Sidebar.User.displayName = 'Template.Portal.Sidebar.User';
Sidebar.Data.displayName = 'Template.Portal.Sidebar.Data';
Sidebar.Navigation.displayName = 'Template.Portal.Sidebar.Navigation';
Sidebar.Footer.displayName = 'Template.Portal.Sidebar.Footer';

import React from 'react';
import type { PolymorphicComponentProps } from '@entur/utils';
import { useControllableProp } from '@entur/utils';
import classNames from 'classnames';
import { LeftArrowIcon, RightArrowIcon } from '@entur/icons';
import { Contrast } from '../../Contrast';
import { Flex } from '../Flex';
import { Grid } from '../Grid';
import { SidebarContext } from './SidebarContext';
import './Sidebar.scss';

type SidebarOwnProps = {
  /** Toggle contrast styling for the sidebar */
  contrast?: boolean;
  /** Enable collapse functionality */
  collapsible?: boolean;
  /** Controlled collapsed state */
  collapsed?: boolean;
  /** Callback when the sidebar is toggled */
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

const SidebarLogo = React.forwardRef(
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

const SidebarUser = React.forwardRef(
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

const SidebarData = React.forwardRef(
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

const SidebarNavigation = React.forwardRef(
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

const SidebarFooter = React.forwardRef(
  <E extends React.ElementType = typeof defaultFooterElement>(
    { children, className, as, ...rest }: SidebarSectionProps<E>,
    ref?: React.Ref<Element>,
  ) => {
    const Element: React.ElementType = as || defaultFooterElement;
    return (
      <Element
        ref={ref}
        className={classNames('eds-layout-template-sidebar__footer', className)}
        {...rest}
      >
        {children}
      </Element>
    );
  },
);

const CollapseToggle: React.FC<{
  isCollapsed: boolean;
  onToggle: () => void;
  openLabel: string;
  closeLabel: string;
}> = ({ isCollapsed, onToggle, openLabel, closeLabel }) => (
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

const SidebarRoot = React.forwardRef(
  <E extends React.ElementType = typeof defaultSidebarElement>(
    {
      children,
      className,
      style,
      contrast = true,
      collapsible = false,
      collapsed,
      onCollapseToggle,
      openSidebarAriaLabel = 'Åpne sidemeny',
      closeSidebarAriaLabel = 'Lukk sidemeny',
      as,
      ...rest
    }: SidebarProps<E>,
    ref?: React.Ref<Element>,
  ) => {
    const handleCollapseToggle: (value?: boolean) => void = value => {
      if (value === undefined || !onCollapseToggle) {
        return;
      }
      onCollapseToggle(value);
    };

    const [isCollapsed, setIsCollapsed] = useControllableProp({
      prop: collapsible ? collapsed : undefined,
      defaultValue: false,
      updater: handleCollapseToggle,
    });

    const WrapperElement = contrast ? Contrast : 'div';

    const sidebarClassNames = classNames(
      'eds-layout-template-sidebar',
      {
        'eds-layout-template-sidebar--plain': !contrast,
        'eds-layout-template-sidebar--collapsible': collapsible,
        'eds-layout-template-sidebar--collapsed': collapsible && isCollapsed,
      },
      className,
    );

    if (!collapsible) {
      return (
        <Grid.Item as={WrapperElement} colSpan="1 / 2">
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
        </Grid.Item>
      );
    }

    const collapsedStyle = isCollapsed
      ? ({ ...style, '--eds-sidebar-width': '2rem' } as React.CSSProperties)
      : style;

    return (
      <Grid.Item
        as={WrapperElement}
        colSpan="1 / 2"
        className="eds-layout-template-sidebar-wrapper"
      >
        <SidebarContext.Provider value={{ isCollapsed }}>
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
          <CollapseToggle
            isCollapsed={isCollapsed}
            onToggle={() => setIsCollapsed(!isCollapsed)}
            openLabel={openSidebarAriaLabel}
            closeLabel={closeSidebarAriaLabel}
          />
        </SidebarContext.Provider>
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

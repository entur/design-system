import React from 'react';
import type { PolymorphicComponentProps } from '@entur/utils';
import classNames from 'classnames';
import { Contrast } from '../../Contrast';
import { Flex } from '../Flex';
import { Grid } from '../Grid';
import './Sidebar.scss';

type SidebarOwnProps = {
  /** Toggle contrast styling for the sidebar */
  contrast?: boolean;
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

const SidebarRoot = React.forwardRef(
  <E extends React.ElementType = typeof defaultSidebarElement>(
    {
      children,
      className,
      style,
      contrast = true,
      as,
      ...rest
    }: SidebarProps<E>,
    ref?: React.Ref<Element>,
  ) => {
    const WrapperElement = contrast ? Contrast : 'div';
    return (
      <Grid.Item as={WrapperElement} colSpan="1 / 2">
        <Flex
          ref={ref}
          as={as || defaultSidebarElement}
          direction="column"
          gap="m"
          className={classNames(
            'eds-layout-template-sidebar',
            {
              'eds-layout-template-sidebar--plain': !contrast,
            },
            className,
          )}
          style={style}
          {...rest}
        >
          {children}
        </Flex>
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

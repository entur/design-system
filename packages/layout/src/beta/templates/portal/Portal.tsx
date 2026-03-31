import React from 'react';
import type { PolymorphicComponentProps } from '@entur/utils';
import classNames from 'classnames';
import { Grid } from '../../Grid';
import { Sidebar, SidebarComponent } from '../Sidebar';
import './Portal.scss';

type PortalOwnProps = {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

type PortalStatusBarOwnProps = {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

type PortalMainOwnProps = {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

const defaultStatusBarElement = 'div';
const defaultPortalMainElement = 'main';

export type PortalProps<T extends React.ElementType = typeof Grid> =
  PolymorphicComponentProps<T, PortalOwnProps>;

export type PortalStatusBarProps<
  T extends React.ElementType = typeof defaultStatusBarElement,
> = PolymorphicComponentProps<T, PortalStatusBarOwnProps>;

export type PortalMainProps<
  T extends React.ElementType = typeof defaultPortalMainElement,
> = PolymorphicComponentProps<T, PortalMainOwnProps>;

const PortalRoot = React.forwardRef(
  <E extends React.ElementType = typeof Grid>(
    { children, className, style, as, ...rest }: PortalProps<E>,
    ref?: React.Ref<Element>,
  ) => {
    return (
      <Grid
        ref={ref}
        as={as}
        gap="none"
        columnGap="m"
        className={classNames('eds-layout-template-portal', className)}
        style={style}
        {...rest}
      >
        {children}
      </Grid>
    );
  },
);

const PortalStatusBar = React.forwardRef(
  <E extends React.ElementType = typeof defaultStatusBarElement>(
    { children, className, as, ...rest }: PortalStatusBarProps<E>,
    ref?: React.Ref<Element>,
  ) => {
    return (
      <Grid.Item
        ref={ref}
        as={as || defaultStatusBarElement}
        className={classNames(
          'eds-layout-template-portal__status-bar',
          className,
        )}
        {...rest}
      >
        {children}
      </Grid.Item>
    );
  },
);

const PortalMain = React.forwardRef(
  <E extends React.ElementType = typeof defaultPortalMainElement>(
    { children, className, style, as, ...rest }: PortalMainProps<E>,
    ref?: React.Ref<Element>,
  ) => {
    return (
      <Grid.Item
        ref={ref}
        as={as || defaultPortalMainElement}
        colSpan="2 / -1"
        className={classNames('eds-layout-template-portal__main', className)}
        style={style}
        {...rest}
      >
        {children}
      </Grid.Item>
    );
  },
);

export type PortalComponent = typeof PortalRoot & {
  StatusBar: typeof PortalStatusBar;
  Sidebar: SidebarComponent;
  Main: typeof PortalMain;
};

export const Portal: PortalComponent = Object.assign(PortalRoot, {
  StatusBar: PortalStatusBar,
  Sidebar,
  Main: PortalMain,
});

Portal.displayName = 'Template.Portal';
Portal.StatusBar.displayName = 'Template.Portal.StatusBar';
Portal.Main.displayName = 'Template.Portal.Main';

import React from 'react';
import classNames from 'classnames';
import { Grid } from '../../Grid';
import { Sidebar, SidebarComponent } from '../Sidebar';
import './Portal.scss';

export type PortalProps = React.HTMLAttributes<HTMLDivElement>;

export type PortalMainProps = React.HTMLAttributes<HTMLElement>;

const PortalRoot: React.FC<PortalProps> = ({
  children,
  className,
  style,
  ...rest
}) => {
  return (
    <Grid
      templateColumns="var(--eds-sidebar-width, min-content) minmax(0, 1fr)"
      gap="m"
      className={classNames('eds-layout-template-portal', className)}
      style={style}
      {...rest}
    >
      {children}
    </Grid>
  );
};

const PortalMain: React.FC<PortalMainProps> = ({
  children,
  className,
  style,
  ...rest
}) => {
  return (
    <Grid.Item
      as="main"
      colSpan="2 / -1"
      className={classNames('eds-layout-template-portal__main', className)}
      style={style}
      {...rest}
    >
      {children}
    </Grid.Item>
  );
};

export type PortalComponent = typeof PortalRoot & {
  Sidebar: SidebarComponent;
  Main: typeof PortalMain;
};

export const Portal: PortalComponent = Object.assign(PortalRoot, {
  Sidebar,
  Main: PortalMain,
});

Portal.displayName = 'Template.Portal';
Portal.Main.displayName = 'Template.Portal.Main';

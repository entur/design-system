import React from 'react';
import classNames from 'classnames';
import { Contrast } from '../../Contrast';
import { Flex } from '../Flex';
import { Grid } from '../Grid';
import './Sidebar.scss';

export type SidebarProps = React.HTMLAttributes<HTMLElement> & {
  /** Toggle contrast styling for the sidebar */
  contrast?: boolean;
};

export type SidebarSectionProps = React.HTMLAttributes<HTMLElement>;

const SidebarLogo: React.FC<SidebarSectionProps> = ({ children, ...rest }) => {
  return <div {...rest}>{children}</div>;
};

const SidebarUser: React.FC<SidebarSectionProps> = ({ children, ...rest }) => {
  return <div {...rest}>{children}</div>;
};

const SidebarData: React.FC<SidebarSectionProps> = ({ children, ...rest }) => {
  return <div {...rest}>{children}</div>;
};

const SidebarNavigation: React.FC<SidebarSectionProps> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <nav
      className={classNames(
        'eds-layout-template-sidebar__navigation',
        className,
      )}
      {...rest}
    >
      {children}
    </nav>
  );
};

const SidebarFooter: React.FC<SidebarSectionProps> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <footer
      className={classNames('eds-layout-template-sidebar__footer', className)}
      {...rest}
    >
      {children}
    </footer>
  );
};

const SidebarRoot: React.FC<SidebarProps> = ({
  children,
  className,
  style,
  contrast = true,
  ...rest
}) => {
  const WrapperElement = contrast ? Contrast : 'div';
  return (
    <Grid.Item as={WrapperElement} colSpan="1 / 2" rowSpan="1 / 2">
      <Flex
        as="aside"
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
};

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

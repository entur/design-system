import React from 'react';
import { Link, MenuItem } from 'docz';
import { Location, WindowLocation } from '@reach/router';
import { Menu as EnturMenu, MenuItem as EnturMenuItem } from '@entur/menu';
import './SiteSidebar.scss';

const removeTrailingSlash = (str: string) =>
  str.endsWith('/') ? str.slice(0, -1) : str;

const isActive = (route = '', location: WindowLocation) =>
  removeTrailingSlash(route) === removeTrailingSlash(location.pathname);

type SiteSidebarProps = {
  menuItems: MenuItem[] | null;
};
export const SiteSidebar: React.FC<SiteSidebarProps> = ({ menuItems }) => {
  if (!menuItems) {
    return null;
  }
  return (
    <Location>
      {({ location }) => (
        <EnturMenu>
          {menuItems.map(menuItem => (
            <EnturMenuItem
              key={menuItem.id}
              as={Link}
              to={menuItem.route}
              active={isActive(menuItem.route, location)}
            >
              {menuItem.name}

              {menuItem.menu && (
                <EnturMenu>
                  {menuItem.menu.map(menuItem => (
                    <EnturMenuItem
                      key={menuItem.id}
                      as={Link}
                      to={menuItem.route}
                      active={isActive(menuItem.route, location)}
                    >
                      {menuItem.name}
                    </EnturMenuItem>
                  ))}
                </EnturMenu>
              )}
            </EnturMenuItem>
          ))}
        </EnturMenu>
      )}
    </Location>
  );
};

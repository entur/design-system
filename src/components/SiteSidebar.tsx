import React from 'react';
import { Link, MenuItem, useCurrentDoc, useMenus } from 'docz';
import { Location, WindowLocation } from '@reach/router';
import { Contrast } from '@entur/layout';
import { Menu as EnturMenu, MenuItem as EnturMenuItem } from '@entur/menu';
import { SearchBar } from '~/components/SearchBar';
import logoSVG from './logo.svg';
import './SiteSidebar.scss';

const filterMenuItems = (menuItems: MenuItem[], searchString: string) => {
  if (!searchString.length) {
    return menuItems;
  }
  const searchTextRegex = new RegExp(searchString, 'i');

  return menuItems
    .map(menuItem => {
      if (searchTextRegex.test(menuItem.name)) {
        return menuItem;
      }

      if (!menuItem.menu) {
        return null;
      }

      const subMenuHits = menuItem.menu.filter(subMenuItem =>
        searchTextRegex.test(subMenuItem.name),
      );

      if (!subMenuHits.length) {
        return null;
      }
      return {
        ...menuItem,
        menu: subMenuHits,
      };
    })
    .filter(Boolean) as MenuItem[];
};

const isActive = (route = '', location: WindowLocation) =>
  removeTrailingSlash(route) === removeTrailingSlash(location.pathname);

const removeTrailingSlash = (str: string) =>
  str.endsWith('/') ? str.slice(0, -1) : str;

const hasSameParentCategory = (
  menuItem: MenuItem,
  currentDoc: any,
): boolean => {
  if (menuItem.parent === currentDoc.parent) {
    return true;
  }
  return (menuItem.menu || []).some(subMenuItem =>
    hasSameParentCategory(subMenuItem, currentDoc),
  );
};

export const SiteSidebar: React.FC = () => {
  const currentDoc = useCurrentDoc();
  const menuItems =
    useMenus({
      filter: item => hasSameParentCategory(item, currentDoc),
    }) || [];
  const [searchText, setSearchText] = React.useState('');
  const isSearchMode = searchText.length > 0;

  const filteredMenuItems = React.useMemo<MenuItem[]>(
    () => filterMenuItems(menuItems, searchText),
    [menuItems, searchText],
  );
  return (
    <Contrast as="nav" className="site-sidebar-wrapper">
      <Link to="/" className="site-sidebar-logo">
        <img src={logoSVG} alt="Entur logo" className="site-logo" />
      </Link>
      <SearchBar searchText={searchText} onSearchTextChange={setSearchText} />

      <Location>
        {({ location }) => (
          <EnturMenu>
            {filteredMenuItems.map(menuItem => (
              <EnturMenuItem
                key={menuItem.id}
                as={Link}
                to={menuItem.route}
                active={isActive(menuItem.route, location)}
                forceExpandSubMenus={isSearchMode}
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
    </Contrast>
  );
};

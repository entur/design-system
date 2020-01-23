import React from 'react';
import { Link, MenuItem, useCurrentDoc, useMenus } from 'docz';
import { Location, WindowLocation } from '@reach/router';
import { Contrast } from '@entur/layout';
import {
  SideNavigation,
  SideNavigationItem,
  SideNavigationGroup,
} from '@entur/menu';
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
      if (
        searchTextRegex.test(menuItem.name) ||
        searchTextRegex.test(menuItem.tags)
      ) {
        return menuItem;
      }

      if (!menuItem.menu) {
        return null;
      }

      const subMenuHits = menuItem.menu.filter(
        subMenuItem =>
          searchTextRegex.test(subMenuItem.name) ||
          searchTextRegex.test(subMenuItem.tags),
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

  return (Array.isArray(menuItem.menu) ? menuItem.menu : []).some(subMenuItem =>
    hasSameParentCategory(subMenuItem, currentDoc),
  );
};

export const SiteSidebar: React.FC = () => {
  const currentDoc = useCurrentDoc();
  const menuItems =
    useMenus({
      filter: item => hasSameParentCategory(item, currentDoc) && !item.index,
    }) || [];

  return (
    <Contrast as="nav" className="site-sidebar-wrapper">
      <Link to="/" className="site-sidebar__logo">
        <img
          src={logoSVG}
          alt="Entur logo"
          className="site-sidebar__logo-svg"
        />
      </Link>

      <Location>
        {({ location }) =>
          currentDoc.parent === 'Komponenter' ? (
            <ComponentsSideNavigation
              location={location}
              menuItems={menuItems}
            />
          ) : (
            <SimpleSideNavigation location={location} menuItems={menuItems} />
          )
        }
      </Location>
    </Contrast>
  );
};

type SimpleSideNavigationProps = {
  menuItems: MenuItem[];
  location: WindowLocation;
};
const SimpleSideNavigation: React.FC<SimpleSideNavigationProps> = ({
  menuItems,
  location,
}) => {
  function compare(a: MenuItem, b: MenuItem) {
    // Use toUpperCase() to ignore character casing
    const menuItemAOrder = a.order ? a.order : 1000;
    const menuItemBOrder = b.order ? b.order : 1000;

    let comparison = 0;
    if (menuItemAOrder > menuItemBOrder) {
      comparison = 1;
    } else if (menuItemAOrder < menuItemBOrder) {
      comparison = -1;
    }
    return comparison;
  }
  menuItems.sort(compare);

  return (
    <SideNavigation style={{ marginTop: '1.5rem' }}>
      {menuItems.map(menuItem => (
        <SideNavigationItem
          key={menuItem.id}
          as={Link}
          to={menuItem.route}
          active={isActive(menuItem.route, location)}
        >
          {menuItem.name}

          {menuItem.menu && (
            <SideNavigation>
              {menuItem.menu.map(menuItem => (
                <SideNavigationItem
                  key={menuItem.id}
                  as={Link}
                  to={menuItem.route}
                  active={isActive(menuItem.route, location)}
                >
                  {menuItem.name}
                </SideNavigationItem>
              ))}
            </SideNavigation>
          )}
        </SideNavigationItem>
      ))}
    </SideNavigation>
  );
};

const componentsMenuSortOrder = {
  Ressurser: 1,
  Knapper: 2,
  Skjemaelementer: 3,
  Navigasjon: 4,
  'Layout & Flater': 5,
  Feedback: 6,
} as any;
const sortComponentMenus = (a: MenuItem, b: MenuItem) => {
  const aSortOrder = componentsMenuSortOrder[a.name] || 10;
  const bSortOrder = componentsMenuSortOrder[b.name] || 10;
  return aSortOrder - bSortOrder;
};

type ComponentsSideNavigationProps = {
  menuItems: MenuItem[];
  location: WindowLocation;
};
const ComponentsSideNavigation: React.FC<ComponentsSideNavigationProps> = ({
  menuItems,
  location,
}) => {
  const [searchText, setSearchText] = React.useState('');

  const filteredMenuItems = React.useMemo<MenuItem[]>(
    () => filterMenuItems(menuItems, searchText),
    [menuItems, searchText],
  );

  return (
    <>
      <SearchBar
        className="site-sitebar__searchbar"
        searchText={searchText}
        onSearchTextChange={setSearchText}
      />
      {filteredMenuItems
        .filter(topLevelMenu => topLevelMenu.menu)
        .sort(sortComponentMenus)
        .map(topLevelMenu => (
          <SideNavigationGroup
            defaultOpen={true}
            open={searchText !== '' ? true : undefined}
            title={topLevelMenu.name}
            key={topLevelMenu.id}
            className="site-sidebar__group"
          >
            <SideNavigation size="small">
              {topLevelMenu.menu!.map(menuItem => (
                <SideNavigationItem
                  key={menuItem.id}
                  as={Link}
                  to={menuItem.route}
                  active={isActive(menuItem.route, location)}
                >
                  {menuItem.name}
                </SideNavigationItem>
              ))}
            </SideNavigation>
          </SideNavigationGroup>
        ))}
    </>
  );
};

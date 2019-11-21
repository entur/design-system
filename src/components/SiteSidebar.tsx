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

  return (Array.isArray(menuItem.menu) ? menuItem.menu : []).some(subMenuItem =>
    hasSameParentCategory(subMenuItem, currentDoc),
  );
};

export const SiteSidebar: React.FC = () => {
  const currentDoc = useCurrentDoc();
  const menuItems =
    useMenus({
      filter: item => hasSameParentCategory(item, currentDoc),
    }) || [];

  return (
    <Contrast as="nav" className="site-sidebar-wrapper">
      <Link to="/" className="site-sidebar-logo">
        <img src={logoSVG} alt="Entur logo" className="site-logo" />
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
  return (
    <SideNavigation>
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
  Resources: 1,
  Buttons: 2,
  Inputs: 3,
  Navigation: 4,
  'Layouts & Surfaces': 5,
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
      <SearchBar searchText={searchText} onSearchTextChange={setSearchText} />
      {filteredMenuItems
        .filter(topLevelMenu => topLevelMenu.menu)
        .sort(sortComponentMenus)
        .map(topLevelMenu => (
          <SideNavigationGroup
            defaultOpen={true}
            open={searchText !== '' ? true : undefined}
            title={topLevelMenu.name}
            key={topLevelMenu.id}
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

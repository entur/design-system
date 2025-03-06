import * as React from 'react';
import { Link } from 'gatsby';
import { useLocation } from '@reach/router';
import classNames from 'classnames';
import {
  SideNavigation as EnturSideNavigation,
  SideNavigationItem,
  SideNavigationGroup,
} from '@entur/menu';
import {
  removeTrailingSlash,
  isActive,
  MenuItem,
  hasSameParentCategory,
  compare,
  sortComponentMenus,
  sorters,
} from './utils';

import SearchBar from './SearchBar';

import './SideNavigation.scss';

type SideNavigationProps = {
  mobile?: boolean;
  menuItems: MenuItem[];
  className?: string;
  onClickMenuItem?: () => void;
};

const SideNavigation: React.FC<SideNavigationProps> = ({
  mobile = false,
  menuItems,
  className,
  onClickMenuItem,
}) => {
  const location = useLocation();
  const [searchText, setSearchText] = React.useState('');

  const currentPathSegments = removeTrailingSlash(location.pathname)?.split(
    '/',
  );
  const parentPath =
    currentPathSegments !== undefined && currentPathSegments.length > 1
      ? currentPathSegments[1]
      : '';

  // Filter, group, and sort menu items
  const processedMenuItems = React.useMemo(() => {
    const grouped: Record<string, MenuItem[]> = {};
    const ungrouped: MenuItem[] = [];

    menuItems
      .filter(
        item =>
          hasSameParentCategory(item, parentPath) && !item.frontmatter.hide,
      )
      .forEach(item => {
        const { menu } = item.frontmatter;

        if (
          !searchText ||
          new RegExp(searchText, 'i').test(item.frontmatter.title)
        ) {
          if (menu) {
            if (!grouped[menu]) grouped[menu] = [];
            grouped[menu].push(item);
          } else {
            ungrouped.push(item);
          }
        }
      });

    Object.values(grouped).forEach(group => group.sort(compare));
    ungrouped.sort(compare);

    return { grouped, ungrouped };
  }, [menuItems, parentPath, searchText]);

  const { grouped, ungrouped } = processedMenuItems;

  // Sort the menu names with sorters
  const sortedMenuNames = React.useMemo(() => {
    const sortOrder = sorters[parentPath] || {}; // Default to empty object if undefined
    return Object.keys(grouped).sort((a, b) => {
      return sortComponentMenus(
        { frontmatter: { title: a } } as MenuItem,
        { frontmatter: { title: b } } as MenuItem,
        sortOrder,
      );
    });
  }, [grouped, parentPath]);

  return (
    <div className={classNames('side-navigation-wrapper', className)}>
      <SearchBar
        className="side-navigation__searchbar"
        searchText={searchText}
        onSearchTextChange={setSearchText}
      />
      <EnturSideNavigation style={{ marginTop: mobile ? '0rem' : '1.5rem' }}>
        {sortedMenuNames.map(menuName => (
          <SideNavigationGroup
            key={menuName}
            defaultOpen={true}
            title={menuName}
            className="side-navigation__group"
          >
            {grouped[menuName].map(item => (
              <SideNavigationItem
                key={item.id}
                as={Link}
                to={item.frontmatter.route || ''}
                active={isActive(item.frontmatter.route || '', location)}
                onClick={onClickMenuItem}
              >
                {item.frontmatter.title}
              </SideNavigationItem>
            ))}
          </SideNavigationGroup>
        ))}
        {ungrouped.map(item => (
          <SideNavigationItem
            key={item.id}
            as={Link}
            to={item.frontmatter.route || ''}
            active={isActive(item.frontmatter.route || '', location)}
            onClick={onClickMenuItem}
          >
            {item.frontmatter.title}
          </SideNavigationItem>
        ))}
      </EnturSideNavigation>
    </div>
  );
};

export default SideNavigation;

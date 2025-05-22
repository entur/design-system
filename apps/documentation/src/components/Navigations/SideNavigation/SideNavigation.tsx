import React from 'react';
import { Link } from 'gatsby';
import classNames from 'classnames';
import {
  SideNavigation as EnturSideNavigation,
  SideNavigationItem,
  SideNavigationGroup,
} from '@entur/menu';
import { fuzzy } from 'fast-fuzzy';
import {
  isActive,
  MenuItem,
  hasSameParentCategory as hasSameCategory,
  menuItemComparator,
  sortSubCategoriesForCategory,
  removeLeadingAndTrailingSlash,
  normalizeString,
  getSanitizedPath,
} from './utils';

import SearchBar from './SearchBar';

import './SideNavigation.scss';

type SideNavigationProps = {
  mobile?: boolean;
  menuItems: MenuItem[];
  className?: string;
  onClickMenuItem?: () => void;
  currentLocation: Location;
};

const SideNavigation: React.FC<SideNavigationProps> = ({
  mobile = false,
  menuItems,
  className,
  onClickMenuItem,
  currentLocation,
}) => {
  const [searchText, setSearchText] = React.useState('');

  const currentPathSegments = removeLeadingAndTrailingSlash(
    currentLocation.pathname,
  )?.split('/');
  const currentCategory = currentPathSegments?.[0] ?? '';

  // Filter, group, and sort menu items
  const processedMenuItems = React.useMemo(() => {
    const grouped: Record<string, MenuItem[]> = {};
    const ungrouped: MenuItem[] = [];
    menuItems
      .filter(
        item =>
          (searchText || normalizeString(item.category) === currentCategory) &&
          !item.hide,
      )
      .forEach(item => {
        const { subcategory } = item;
        if (!searchText || fuzzy(searchText, item.title) > 0.5) {
          if (subcategory) {
            if (!grouped[subcategory]) grouped[subcategory] = [];
            grouped[subcategory].push(item);
          } else {
            ungrouped.push(item);
          }
        }
      });

    Object.values(grouped).forEach(group => group.sort(menuItemComparator));
    ungrouped.sort(menuItemComparator);

    const sortedGrouped = Object.entries(grouped).sort(
      (subcategoryA, subcategoryB) => {
        return sortSubCategoriesForCategory(
          subcategoryA[0],
          subcategoryB[0],
          currentCategory,
        );
      },
    );

    return { sortedGrouped, ungrouped };
  }, [menuItems, currentCategory, searchText]);

  const MenuItem = (props: { item: MenuItem }) => {
    const { item } = props;
    return (
      <SideNavigationItem
        key={item.id}
        as={Link}
        to={getSanitizedPath(item) || ''}
        active={isActive(getSanitizedPath(item) || '', currentLocation)}
        onClick={onClickMenuItem}
      >
        {item.title}
      </SideNavigationItem>
    );
  };

  const { sortedGrouped, ungrouped } = processedMenuItems;

  return (
    <div className={classNames('side-navigation-wrapper', className)}>
      <SearchBar
        className="side-navigation__searchbar"
        searchText={searchText}
        onSearchTextChange={setSearchText}
      />
      <EnturSideNavigation style={{ marginTop: mobile ? '0rem' : '1.5rem' }}>
        {sortedGrouped.map(([subcategory, subcategoryMenuItems]) => (
          <SideNavigationGroup
            key={subcategory}
            defaultOpen={true}
            title={subcategory}
            className="side-navigation__group"
          >
            {subcategoryMenuItems.map(item => (
              <MenuItem item={item} />
            ))}
          </SideNavigationGroup>
        ))}
        {ungrouped.map(item => (
          <MenuItem item={item} />
        ))}
      </EnturSideNavigation>
    </div>
  );
};

export default SideNavigation;

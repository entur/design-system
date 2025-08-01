import React from 'react';
import { Link } from 'gatsby';
import classNames from 'classnames';
import {
  SideNavigation as EnturSideNavigation,
  SideNavigationItem,
  SideNavigationGroup,
} from '@entur/menu';

import { SecondaryButton } from '@entur/button';
import { SearchIcon } from '@entur/icons';
import { Badge } from '@entur/layout';

import {
  isActive,
  MenuItem,
  menuItemComparator,
  sortSubCategoriesForCategory,
  removeLeadingAndTrailingSlash,
  normalizeString,
  getSanitizedPath,
} from './utils';

import { useSearch } from '../../Search/SearchContext';

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
  const { openSearch } = useSearch();

  const currentPathSegments = removeLeadingAndTrailingSlash(
    currentLocation.pathname,
  )?.split('/');
  const currentCategory = normalizeString(currentPathSegments?.[0]) ?? '';

  // Filter, group, and sort menu items
  const processedMenuItems = React.useMemo(() => {
    const grouped: Record<string, MenuItem[]> = {};
    const ungrouped: MenuItem[] = [];
    menuItems
      .filter(item => normalizeString(item.category) === currentCategory)
      .forEach(item => {
        const { subcategory } = item;
        if (subcategory) {
          if (!grouped[subcategory]) grouped[subcategory] = [];
          grouped[subcategory].push(item);
        } else {
          ungrouped.push(item);
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
  }, [menuItems, currentCategory]);

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
      <SearchBar onOpenSearch={openSearch} />
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

type SearchBarProps = {
  /** Callback to open the search modal */
  onOpenSearch: () => void;
  /** Ekstra klassenavn */
  className?: string;
};

const SearchBar: React.FC<SearchBarProps> = ({ onOpenSearch }) => {
  return (
    <SecondaryButton
      aria-label="Søk i dokumentasjon"
      className="side-navigation__searchbar__button"
      onClick={onOpenSearch}
      width="fluid"
    >
      <SearchIcon aria-hidden="true" />
      <span>Søk …</span>
      <Badge
        as="kbd"
        variant="neutral"
        type="status"
        style={{
          width: '5ch',
          minWidth: 'unset',
          paddingInline: '0.25rem',
        }}
      >
        ⌘ k
      </Badge>
    </SecondaryButton>
  );
};

export default SideNavigation;

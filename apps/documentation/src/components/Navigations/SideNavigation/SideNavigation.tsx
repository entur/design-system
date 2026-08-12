import React from 'react';
import { Link } from 'gatsby';
import classNames from 'classnames';
import { SideNavigation as EnturSideNavigation } from '@entur/menu/beta';

import { ArticleTag } from '../../Common/ArticleTag';

import {
  MenuItem,
  getSanitizedPath,
  groupSubcategoryFor,
  isActive,
  menuItemComparator,
  normalizeString,
  removeLeadingAndTrailingSlash,
  sortSubCategoriesForCategory,
} from './utils';

import './SideNavigation.scss';

// useLayoutEffect would warn during Gatsby's server render, where it never runs
const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

type SideNavigationProps = {
  menuItems: MenuItem[];
  className?: string;
  onClickMenuItem?: () => void;
  currentLocation: Location;
};

const SideNavigation: React.FC<SideNavigationProps> = ({
  menuItems,
  className,
  onClickMenuItem,
  currentLocation,
}) => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const currentPathSegments = removeLeadingAndTrailingSlash(
    currentLocation.pathname,
  )?.split('/');
  const currentCategory = normalizeString(currentPathSegments?.[0]) ?? '';

  // The menu is long enough that the current page is often below the fold.
  // Centre it in the sidebar when it is out of view, before the first paint.
  // Only the sidebar scrolls — scrollIntoView would move the page as well.
  useIsomorphicLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const activeItem = wrapper?.querySelector('[aria-current="page"]');
    if (!wrapper || !activeItem) return;

    const wrapperBox = wrapper.getBoundingClientRect();
    const itemBox = activeItem.getBoundingClientRect();
    const isInView =
      itemBox.top >= wrapperBox.top && itemBox.bottom <= wrapperBox.bottom;
    if (isInView) return;

    wrapper.scrollTop +=
      itemBox.top -
      wrapperBox.top -
      (wrapper.clientHeight - itemBox.height) / 2;
  }, [currentLocation.pathname]);

  // Filter, group, and sort menu items
  const processedMenuItems = React.useMemo(() => {
    const grouped: Record<string, MenuItem[]> = {};
    const ungrouped: MenuItem[] = [];
    menuItems
      .filter(item => normalizeString(item.category) === currentCategory)
      .forEach(item => {
        const subcategory = groupSubcategoryFor(item);
        const subcategoryLowercase = subcategory?.toLowerCase();
        if (subcategoryLowercase) {
          if (!grouped[subcategoryLowercase])
            grouped[subcategoryLowercase] = [];
          grouped[subcategoryLowercase].push(item);
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
    const path = item.path || getSanitizedPath(item) || '';
    return (
      <EnturSideNavigation.Item
        key={item.id}
        as={Link}
        to={path}
        active={isActive(path, currentLocation)}
        onClick={onClickMenuItem}
        badge={item.tag ? <ArticleTag tag={item.tag} /> : undefined}
      >
        {item.title}
      </EnturSideNavigation.Item>
    );
  };

  const { sortedGrouped, ungrouped } = processedMenuItems;

  return (
    <div
      className={classNames('side-navigation-wrapper', className)}
      ref={wrapperRef}
    >
      <EnturSideNavigation className="side-navigation__menu">
        {sortedGrouped.map(([subcategory, subcategoryMenuItems]) => (
          <EnturSideNavigation.Group key={subcategory} title={subcategory}>
            {subcategoryMenuItems.map(item => (
              <MenuItem key={item.id} item={item} />
            ))}
          </EnturSideNavigation.Group>
        ))}
        {ungrouped.map(item => (
          <MenuItem key={item.id} item={item} />
        ))}
      </EnturSideNavigation>
    </div>
  );
};

export default SideNavigation;

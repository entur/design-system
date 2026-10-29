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
    const subpages: Record<string, MenuItem[]> = {};
    menuItems
      .filter(item => normalizeString(item.category) === currentCategory)
      .forEach(item => {
        if (item.parentId) {
          (subpages[item.parentId] ??= []).push(item);
          return;
        }
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
    Object.values(subpages).forEach(group => group.sort(menuItemComparator));

    const sortedGrouped = Object.entries(grouped).sort(
      (subcategoryA, subcategoryB) => {
        return sortSubCategoriesForCategory(
          subcategoryA[0],
          subcategoryB[0],
          currentCategory,
        );
      },
    );

    return { sortedGrouped, ungrouped, subpages };
  }, [menuItems, currentCategory]);

  const { sortedGrouped, ungrouped, subpages } = processedMenuItems;

  const pathFor = (item: MenuItem) => item.path || getSanitizedPath(item) || '';

  // ExpandableItem reads `active` on its children to open itself
  const MenuLink = ({
    item,
    title,
  }: {
    item: MenuItem;
    title?: string;
    active: boolean;
  }) => {
    const path = pathFor(item);
    return (
      <EnturSideNavigation.Item
        as={Link}
        to={path}
        active={isActive(path, currentLocation)}
        onClick={onClickMenuItem}
        badge={!title && item.tag ? <ArticleTag tag={item.tag} /> : undefined}
      >
        {title ?? item.title}
      </EnturSideNavigation.Item>
    );
  };

  const MenuItem = ({ item }: { item: MenuItem }) => {
    const children = subpages[item.id];
    const active = (child: MenuItem) =>
      isActive(pathFor(child), currentLocation);
    if (!children) return <MenuLink item={item} active={active(item)} />;

    // ExpandableItem is a button, so the parent page gets a link of its own
    return (
      <EnturSideNavigation.ExpandableItem
        title={item.title}
        badge={item.tag ? <ArticleTag tag={item.tag} /> : undefined}
      >
        <MenuLink item={item} title="Oversikt" active={active(item)} />
        {children.map(child => (
          <MenuLink key={child.id} item={child} active={active(child)} />
        ))}
      </EnturSideNavigation.ExpandableItem>
    );
  };

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

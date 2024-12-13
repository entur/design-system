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
  useSideMenuScroll,
} from './utils';
import { Media } from '@providers/MediaBreakpoint';
import SearchBar from './SearchBar';

import './SideNavigation.scss';

type SideNavigationProps = {
  mobile?: boolean;
  menuItems: MenuItem[];
  className?: string;
  openSidebar?: boolean;
};

const SideNavigation: React.FC<SideNavigationProps> = ({
  mobile = false,
  openSidebar = false,
  menuItems,
  className,
}) => {
  const location = useLocation();

  const [searchText, setSearchText] = React.useState('');

  const currentPathSegments = removeTrailingSlash(location.pathname).split('/');
  const parentPath =
    currentPathSegments.length > 1 ? currentPathSegments[1] : '';

  const [scrollPosition, setScrollPosition] = useSideMenuScroll(parentPath);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // TODO fix scroll position on mobile
  React.useEffect(() => {
    // Restore the scroll position when the sidebar is opened on mobile
    if (mobile && openSidebar) {
      if (menuRef.current) {
        setScrollPosition(menuRef.current.scrollTop);
      }
    }
  }, [mobile, openSidebar, setScrollPosition]);

  React.useEffect(() => {
    // Apply the saved scroll position
    if (menuRef.current) {
      menuRef.current.scrollTop = scrollPosition;
    }
  }, [scrollPosition]);

  const handleScroll = () => {
    if (menuRef.current) {
      setScrollPosition(menuRef.current.scrollTop);
    }
  };

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
    <div
      onScroll={handleScroll}
      ref={menuRef}
      className={classNames('side-navigation-wrapper', className)}
    >
      <Media greaterThanOrEqual="desktop">
        <SearchBar
          className="side-navigation__searchbar"
          searchText={searchText}
          onSearchTextChange={setSearchText}
        />
      </Media>
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
          >
            {item.frontmatter.title}
          </SideNavigationItem>
        ))}
      </EnturSideNavigation>
    </div>
  );
};

export default SideNavigation;

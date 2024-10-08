import React from 'react';
import classNames from 'classnames';
import { Link, MenuItem, useCurrentDoc, useMenus } from 'docz';
import { motion, AnimatePresence } from 'framer-motion';
import { Location, WindowLocation } from '@reach/router';

import { FloatingButton } from '@entur/button';
import { LeftArrowIcon } from '@entur/icons';
import { useContrast } from '@entur/layout';
import {
  SideNavigation,
  SideNavigationGroup,
  SideNavigationItem,
} from '@entur/menu';
import { space } from '@entur/tokens';
import { Heading2 } from '@entur/typography';

import { SearchBar } from '~/components/SearchBar';
import { Media } from '~/utils/Providers/MediaBreakpoint';
import {
  usePersistedState,
  useSettings,
} from '~/utils/Providers/SettingsContext';

import './SiteSidebar.scss';

import logo from '~/components/logo.svg';
import logoDark from '~/components/logoDark.svg';

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

function useSideMenuScroll<Type>(page: string) {
  const [currentPage, setCurrentPage] = usePersistedState('currentScroll', '');

  const useStateResult = React.useState<Type>(() => {
    if (typeof window === 'undefined') {
      // Server side
      return 0;
    }

    if (page !== '' && page !== currentPage) {
      return 0;
    }
    return JSON.parse(localStorage.getItem('scroll') as string) || 0;
  });
  const [state] = useStateResult;
  React.useEffect(() => {
    localStorage.setItem('scroll', JSON.stringify(state));
  }, [page, state]);

  React.useEffect(() => {
    if (page && page !== currentPage) {
      localStorage.setItem('scroll', '0');
      setCurrentPage(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);
  return useStateResult;
}

export const SiteSidebar: React.FC<{
  className?: string;
  mobile?: boolean;
  closeMenu?: () => void;
  sideMenu?: boolean;
}> = props => {
  const menuRef = React.useRef<HTMLDivElement>(null);
  const currentDoc = useCurrentDoc();
  const [scrollPosition, setScrollPosition] = useSideMenuScroll<number>(
    currentDoc.parent,
  );
  const { colorMode } = useSettings();
  const isContrast = useContrast();
  const [openSidebar, setOpenSidebar] = React.useState(false);

  React.useEffect(() => {
    if (props.mobile && props.sideMenu) {
      setScrollPosition(menuRef?.current?.scrollTop ?? 0);
      window.scrollTo(0, 0);
      setOpenSidebar(props.sideMenu);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.sideMenu]);

  const menuItems =
    useMenus({
      filter: item => hasSameParentCategory(item, currentDoc) && !item.index,
    }) || [];

  React.useEffect(() => {
    menuRef?.current?.scrollTo(0, scrollPosition);
  }, [menuRef, scrollPosition, currentDoc]);

  const handleScroll = () => {
    setScrollPosition(menuRef?.current?.scrollTop ?? 0);
  };

  return (
    <>
      <Media greaterThanOrEqual="desktop">
        <div
          onScroll={handleScroll}
          ref={menuRef}
          className={classNames('site-sidebar-wrapper', props.className)}
        >
          <nav aria-label={`Navigasjon for seksjonen "${currentDoc.parent}"`}>
            <Location>
              {({ location }) =>
                currentDoc.parent !== 'Universell utforming' ? (
                  <ComponentsSideNavigation
                    location={location}
                    menuItems={menuItems}
                  />
                ) : (
                  <SimpleSideNavigation
                    location={location}
                    menuItems={menuItems}
                    mobile={props.mobile}
                  />
                )
              }
            </Location>
          </nav>
        </div>
      </Media>
      <Media at="mobile">
        <AnimatePresence>
          {openSidebar && (
            <motion.div
              variants={{
                right: { opacity: 0 },
                visible: { opacity: 1 },
                left: { opacity: 0 },
              }}
              initial="left"
              animate="visible"
              exit="right"
              transition={{ ease: 'easeOut', duration: 0.25 }}
            >
              <div
                onClick={() => setOpenSidebar(false)}
                className={classNames('site-sidebar__backdrop')}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence
          onExitComplete={() => {
            props.closeMenu && props.closeMenu();
          }}
        >
          {openSidebar && (
            <motion.div
              variants={{
                right: { opacity: 1, x: '-80%' },
                visible: { opacity: 1, x: 0 },
                left: { opacity: 1, x: '-80%' },
              }}
              initial="left"
              animate="visible"
              exit="right"
              transition={{ ease: 'easeOut', duration: 0.25 }}
            >
              <div
                key={1}
                className={classNames('site-sidebar-wrapper', props.className)}
              >
                <nav
                  aria-label={`Navigasjon for seksjonen "${currentDoc.parent}"`}
                >
                  <Location>
                    {({ location }) => (
                      <div className="site-sidebar__background">
                        <Link
                          to="/"
                          className="top-navigation__logo"
                          style={{
                            marginLeft: space.extraLarge,
                          }}
                        >
                          <img
                            src={
                              colorMode === 'dark' || isContrast
                                ? logoDark
                                : logo
                            }
                            height="20px"
                            width="64px"
                            alt="Entur logo"
                          />
                        </Link>
                        <Heading2
                          margin="none"
                          style={{
                            marginLeft: space.extraLarge,
                            marginTop: space.extraLarge2,
                          }}
                        >
                          {currentDoc.parent}
                        </Heading2>
                        {currentDoc.parent !== 'Universell utforming' ? (
                          <ComponentsSideNavigation
                            location={location}
                            menuItems={menuItems}
                          />
                        ) : (
                          <SimpleSideNavigation
                            location={location}
                            menuItems={menuItems}
                            mobile={props.mobile}
                          />
                        )}
                      </div>
                    )}
                  </Location>
                  <FloatingButton
                    aria-label="Lukk sidemeny"
                    onClick={() => setOpenSidebar(false)}
                    className={classNames('site-sidebar__close-menu', {
                      'site-sidebar__close-menu--open': props.sideMenu,
                    })}
                  >
                    <LeftArrowIcon />
                  </FloatingButton>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Media>
    </>
  );
};

type SimpleSideNavigationProps = {
  menuItems: MenuItem[];
  location: WindowLocation;
  mobile?: boolean;
};
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
const SimpleSideNavigation: React.FC<SimpleSideNavigationProps> = ({
  menuItems,
  location,
  mobile = false,
}) => {
  menuItems.sort(compare);
  const topMargin = mobile ? '0rem' : '1.5rem';
  return (
    <SideNavigation style={{ marginTop: topMargin }}>
      {menuItems.map(menuItem => (
        <SideNavigationItem
          key={menuItem.id}
          as={Link}
          to={menuItem.route ?? ''}
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
// add sorters for new main-menutitems here
const componentsMenuSortOrder = {
  Ressurser: 1,
  Knapper: 2,
  Skjemaelementer: 3,
  Navigasjon: 4,
  'Layout & Flater': 5,
  Feedback: 6,
} as any;
const komIGangMenuSortOrder = {
  Introduksjon: 1,
  'For designere': 2,
  'For utviklere': 3,
} as any;
const visuellIdentitetMenuSortOrder = {
  Introduksjon: 1,
  Verktøykassen: 2,
  Maler: 3,
} as any;

const tokensMenuSortOrder = {
  Fargetokens: 1,
  'Øvrige tokens': 2,
} as any;

const sortComponentMenus = (a: MenuItem, b: MenuItem, sortOrder: any) => {
  const aSortOrder = sortOrder[a.name] || 10;
  const bSortOrder = sortOrder[b.name] || 10;
  return aSortOrder - bSortOrder;
};
const sorters: { [sorter: string]: any } = {
  'Kom i gang': komIGangMenuSortOrder,
  Identitet: visuellIdentitetMenuSortOrder,
  Komponenter: componentsMenuSortOrder,
  Tokens: tokensMenuSortOrder,
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
  const sortBy = menuItems?.[0].menu?.[0].parent
    ? sorters[menuItems[0].menu[0].parent]
    : componentsMenuSortOrder;
  const isComponents = sortBy === componentsMenuSortOrder;
  const menuSize: 'small' | 'medium' = isComponents ? 'small' : 'medium';
  return (
    <>
      <Media greaterThanOrEqual="desktop">
        <SearchBar
          className="site-sitebar__searchbar"
          searchText={searchText}
          onSearchTextChange={setSearchText}
        />
      </Media>
      <SideNavigation size={menuSize}>
        {filteredMenuItems
          .filter(topLevelMenu => topLevelMenu.menu)
          .sort((a, b) => sortComponentMenus(a, b, sortBy))
          .map(topLevelMenu => (
            <SideNavigationGroup
              defaultOpen={true}
              open={searchText !== '' ? true : undefined}
              title={topLevelMenu.name}
              key={topLevelMenu.id}
              className="site-sidebar__group"
            >
              {topLevelMenu.menu &&
                topLevelMenu.menu.sort(compare).map(menuItem => (
                  <SideNavigationItem
                    key={menuItem.id}
                    as={Link}
                    to={menuItem.route ? menuItem.route : '/'}
                    active={isActive(menuItem.route, location)}
                  >
                    {menuItem.name}
                  </SideNavigationItem>
                ))}
            </SideNavigationGroup>
          ))}
      </SideNavigation>
    </>
  );
};

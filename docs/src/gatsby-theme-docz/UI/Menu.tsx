import React from 'react';
import { useMenus, Link, useCurrentDoc, MenuItem, Entry } from 'docz';
import { Location, WindowLocation } from '@reach/router';
import { Menu as EnturMenu, MenuItem as EnturMenuItem } from '@entur/menu';
import { SearchBar } from './SearchBar';
import classNames from 'classnames';
import debounce from '../../utils/debounce';
import './menu.scss';
import logoSVG from './designsystem-Logo.svg';

const removeTrailingSlash = (str: string) =>
  str.endsWith('/') ? str.slice(0, -1) : str;

const isActive = (route = '', location: WindowLocation) =>
  removeTrailingSlash(route) === removeTrailingSlash(location.pathname);

type SidebarProps = {
  menuItems: MenuItem[] | null;
};
const Sidebar: React.FC<SidebarProps> = ({ menuItems }) => {
  if (!menuItems) {
    return null;
  }
  return (
    <Location>
      {({ location }) => (
        <EnturMenu>
          {menuItems.map(menuItem => (
            <EnturMenuItem
              key={menuItem.id}
              as={Link}
              to={menuItem.route}
              active={isActive(menuItem.route, location)}
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
  );
};

function useCurrentActiveHeading(headings: Entry['headings']) {
  let headingElements: HTMLElement[] = [];
  const [activeHeading, setActiveHeading] = React.useState<string | null>(null);

  const findActiveHeading = debounce(() => {
    for (let nextElement of headingElements) {
      const nextTop = nextElement.getBoundingClientRect().top;
      if (nextTop >= 0) {
        setActiveHeading(nextElement.id);
        break;
      }
    }
  }, 16);

  React.useEffect(() => {
    headingElements = headings.map(
      heading => document.getElementById(heading.slug) as HTMLElement,
    );
    window.addEventListener('resize', findActiveHeading);
    window.addEventListener('scroll', findActiveHeading);
    findActiveHeading();
    return () => {
      window.removeEventListener('resize', findActiveHeading);
      window.removeEventListener('scroll', findActiveHeading);
    };
  }, []);

  return activeHeading;
}

const TOCNavigation: React.FC = () => {
  const currentDoc = useCurrentDoc() as Entry;
  const headings = currentDoc
    ? currentDoc.headings.filter(heading => heading.depth > 1)
    : [];
  const activeHeading = useCurrentActiveHeading(headings);
  if (headings.length < 2) {
    return null;
  }
  return (
    <nav className="table-of-content-container">
      <ul className="table-of-content">
        {headings.map(heading => (
          <li
            key={heading.slug}
            className={classNames(
              'table-of-content__item',
              `table-of-content__item--depth-${heading.depth}`,
            )}
          >
            <a
              className={classNames('table-of-content__link', {
                'table-of-content__link--active':
                  activeHeading === heading.slug,
              })}
              href={`#${heading.slug}`}
            >
              {heading.value}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

function hasSameParentCategory(menuItem: MenuItem, currentDoc: any): boolean {
  if (menuItem.parent === currentDoc.parent) {
    return true;
  }
  return (menuItem.menu || []).some(subMenuItem =>
    hasSameParentCategory(subMenuItem, currentDoc),
  );
}

export default function Menus() {
  const currentDoc = useCurrentDoc();
  const menuItems = useMenus({
    filter: item => hasSameParentCategory(item, currentDoc),
  });
  let [filtered, setFiltered] = React.useState(menuItems);

  const getLinkProps = ({ isPartiallyCurrent }: any) => ({
    className: classNames('tab-link', {
      'active-tab-link': isPartiallyCurrent,
    }),
  });

  function setFilteredSearch(items: MenuItem[]) {
    setFiltered(items);
  }

  return (
    <>
      <nav className="site-navbar">
        <div className="tab-link-container">
          <Link to="/kom-i-gang" getProps={getLinkProps}>
            Kom i gang
          </Link>
          <Link to="/design-prinsipper" getProps={getLinkProps}>
            Designprinsipper
          </Link>
          <Link to="/visuell-identitet" getProps={getLinkProps}>
            Visuell Identitet
          </Link>
          <Link to="/komponenter" getProps={getLinkProps}>
            Komponenter
          </Link>
        </div>
      </nav>
      <nav className="site-sidebar-wrapper">
        <Link to="/">
          <img src={logoSVG} alt="Entur logo" className="site-logo" />
        </Link>
        <SearchBar
          menuItems={menuItems!}
          propagateFilteredSearch={setFilteredSearch}
        />
        <Sidebar menuItems={filtered} />
      </nav>
      <nav className="heading-navigator-wrapper">
        <TOCNavigation />
      </nav>
    </>
  );
}

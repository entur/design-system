import React from 'react';
import { useMenus, Link, useCurrentDoc, MenuItem } from 'docz';
import { Location, WindowLocation } from '@reach/router';
import { Menu as EnturMenu, MenuItem as EnturMenuItem } from '@entur/menu';
import classNames from 'classnames';
import './menu.scss';
import logoSVG from './enturWhite.svg';

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
              isActive={isActive(menuItem.route, location)}
            >
              {menuItem.name}

              {menuItem.menu && (
                <EnturMenu>
                  {menuItem.menu.map(menuItem => (
                    <EnturMenuItem
                      key={menuItem.id}
                      as={Link}
                      to={menuItem.route}
                      isActive={isActive(menuItem.route, location)}
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

const TOCNavigation: React.FC = () => {
  const currentDoc = useCurrentDoc();
  const headings = currentDoc ? currentDoc.headings : [''];
  if (headings.length < 2) {
    return null;
  }
  return (
    <div className="heading-navigator-links-wrapper">
      {headings.map((heading: any) => (
        <a
          className="heading-link"
          href={`#${heading.slug}`}
          key={heading.depth + heading.slug}
        >
          {heading.value}
        </a>
      ))}
    </div>
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

  const getLinkProps = ({ isPartiallyCurrent }: any) => ({
    className: classNames('tab-link', {
      'active-tab-link': isPartiallyCurrent,
    }),
  });

  return (
    <>
      <nav className="navbar">
        <div className="logo-wrapper">
          <img src={logoSVG} alt="Entur logo" className="logo-container" />
        </div>
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
      <nav className="sidemenu-wrapper">
        {/**Placeholder for search functionality */}
        <input
          type="text"
          className="searchbar-placeholder"
          placeholder="Søk..."
        />
        <Sidebar menuItems={menuItems} />
      </nav>
      <nav className="heading-navigator-wrapper">
        <TOCNavigation />
      </nav>
    </>
  );
}

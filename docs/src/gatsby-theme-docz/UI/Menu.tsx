import React from 'react';
import { useMenus, Link, useCurrentDoc, MenuItem } from 'docz';
import classNames from 'classnames';
import { Contrast } from '@entur/layout';
import { TocNavigation } from 'src/components/TocNavigation';
import { SiteSidebar } from 'src/components/SiteSidebar';
import { SearchBar } from './SearchBar';
import logoSVG from './designsystem-Logo.svg';

import './Menu.scss';

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
      <Contrast as="nav" className="site-sidebar-wrapper">
        <Link to="/">
          <img src={logoSVG} alt="Entur logo" className="site-logo" />
        </Link>
        <SearchBar
          menuItems={menuItems!}
          onFilteredSearchChange={setFilteredSearch}
        />
        <SiteSidebar menuItems={filtered} />
      </Contrast>
      <nav className="heading-navigator-wrapper">
        <TocNavigation />
      </nav>
    </>
  );
}

import React from 'react';
import { Link } from 'docz';
import { TocNavigation } from 'src/components/TocNavigation';
import { SiteSidebar } from 'src/components/SiteSidebar';
import { NavBarItem } from '@entur/menu';
import './Menu.scss';

const getLinkProps = ({ isPartiallyCurrent }: any) => ({
  selected: isPartiallyCurrent ? true : false,
});

export default function Menus() {
  return (
    <>
      <nav className="site-navbar">
        <div className="tab-link-container">
          <NavBarItem
            as={Link}
            to="/kom-i-gang"
            selected={true}
            getProps={getLinkProps}
          >
            Kom i gang
          </NavBarItem>
          <NavBarItem as={Link} to="/design-prinsipper" getProps={getLinkProps}>
            Designprinsipper
          </NavBarItem>
          <NavBarItem as={Link} to="/visuell-identitet" getProps={getLinkProps}>
            Visuell Identitet
          </NavBarItem>
          <NavBarItem as={Link} to="/komponenter" getProps={getLinkProps}>
            Komponenter
          </NavBarItem>
        </div>
      </nav>
      <SiteSidebar />
      <nav className="heading-navigator-wrapper">
        <TocNavigation />
      </nav>
    </>
  );
}

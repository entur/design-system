import React from 'react';
import { Link } from 'docz';
import { Location } from '@reach/router';
import { TopNavigationItem } from '@entur/menu';
import { TocNavigation } from '~/components/TocNavigation';
import { SiteSidebar } from '~/components/SiteSidebar';
import './Menu.scss';

export default function Menus() {
  return (
    <>
      <nav className="site-navbar">
        <div className="tab-link-container">
          <NavItem to="/kom-i-gang">Kom i gang</NavItem>
          <NavItem to="/design-prinsipper">Designprinsipper</NavItem>
          <NavItem to="/visuell-identitet">Visuell Identitet</NavItem>
          <NavItem to="/komponenter">Komponenter</NavItem>
        </div>
      </nav>
      <SiteSidebar />
      <nav className="heading-navigator-wrapper">
        <TocNavigation />
      </nav>
    </>
  );
}

type NavItemProps = {
  to: string;
  children: React.ReactNode;
  [key: string]: any;
};
const NavItem: React.FC<NavItemProps> = props => {
  return (
    <Location>
      {({ location }) => (
        <TopNavigationItem
          as={Link}
          to={props.to}
          active={location.pathname.startsWith(props.to)}
        >
          {props.children}
        </TopNavigationItem>
      )}
    </Location>
  );
};

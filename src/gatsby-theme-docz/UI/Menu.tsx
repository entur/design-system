import React from 'react';
import { Link } from 'docz';
import { Location } from '@reach/router';
import { TopNavigationItem } from '@entur/menu';
import { TocNavigation } from '~/components/TocNavigation';
import { SiteSidebar } from '~/components/SiteSidebar';
import SettingsPanel from '~/components/SettingsPanel';
import './Menu.scss';

const Menu: React.FC<{ className: string }> = ({ className }) => {
  return (
    <div className={className}>
      <nav className="top-navigation" aria-label="Navigasjon, hovedseksjoner">
        <NavItem to="/kom-i-gang">Kom i gang</NavItem>
        <NavItem to="/visuell-identitet">Visuell identitet</NavItem>
        <NavItem to="/komponenter">Komponenter</NavItem>
        <NavItem to="/stil-og-tone">Stil og tone</NavItem>
        <NavItem to="/universell-utforming">Universell utforming</NavItem>
        <SettingsPanel />
      </nav>
      <SiteSidebar />
      <TocNavigation />
    </div>
  );
};

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

export default Menu;

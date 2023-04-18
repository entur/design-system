import React from 'react';
import { Link } from 'docz';
import { Location } from '@reach/router';
import { TopNavigationItem } from '@entur/menu';
import { SiteSidebar } from '~/components/SiteSidebar';
import SettingsPanel from '~/components/SettingsPanel';
import logo from '~/components/logoDark.svg';
import './Menu.scss';

const Menu: React.FC<{ className: string }> = ({ className }) => {
  return (
    <div className={className}>
      <nav className="top-navigation" aria-label="Navigasjon, hovedseksjoner">
        <Link to="/" className="top-navigation__logo">
          <img
            src={logo}
            height="32px"
            width="102px"
            alt="Entur logo, klikk for å gå til startsiden"
          />
        </Link>
        <NavItem to="/kom-i-gang">Kom i gang</NavItem>
        <NavItem to="/identitet">Identitet</NavItem>
        <NavItem to="/komponenter">Komponenter</NavItem>
        <NavItem to="/universell-utforming">Universell utforming</NavItem>
        <SettingsPanel />
      </nav>
      <SiteSidebar />
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

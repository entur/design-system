import React, { useEffect } from 'react';
import { Link } from 'docz';
import { Location } from '@reach/router';
import { TopNavigationItem } from '@entur/menu';
import { SiteSidebar } from '~/components/SiteSidebar';
import SettingsPanel from '~/components/SettingsPanel';
import { useSettings } from '~/components/SettingsContext';
import logoDark from '~/components/logoDark.svg';
import logo from '~/components/logo.svg';
import './Menu.scss';
import classNames from 'classnames';
import { useContrast } from '@entur/layout';

const Menu: React.FC<{ className: string }> = ({ className }) => {
  const { colorMode } = useSettings();
  const isContrast = useContrast();

  return (
    <Location>
      {({ location }) => (
        <div className={className}>
          <nav
            className={classNames('top-navigation', {
              'top-navigation--front-page': location.pathname === '/',
              'eds-contrast': location.pathname === '/',
            })}
            aria-label="Navigasjon, hovedseksjoner"
          >
            <Link to="/" className="top-navigation__logo">
              <img
                src={colorMode === 'dark' || isContrast ? logoDark : logo}
                height="32px"
                width="102px"
                alt="Entur logo, klikk for å gå til startsiden"
              />
            </Link>
            <NavItem to="/kom-i-gang" location={location}>
              Kom i gang
            </NavItem>
            <NavItem to="/identitet" location={location}>
              Identitet
            </NavItem>
            <NavItem to="/komponenter" location={location}>
              Komponenter
            </NavItem>
            <NavItem to="/universell-utforming" location={location}>
              Universell utforming
            </NavItem>
            <SettingsPanel />
          </nav>
          {location.pathname !== '/' && <SiteSidebar />}
        </div>
      )}
    </Location>
  );
};

type NavItemProps = {
  to: string;
  location: { pathname: string };
  children: React.ReactNode;
  [key: string]: any;
};
const NavItem: React.FC<NavItemProps> = props => {
  return (
    <TopNavigationItem
      as={Link}
      to={props.to}
      active={props.location.pathname.startsWith(props.to)}
    >
      {props.children}
    </TopNavigationItem>
  );
};

export default Menu;

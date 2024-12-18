import React from 'react';
import { Link } from 'gatsby';
import { Location } from '@reach/router';
import { TopNavigationItem } from '@entur/menu';
import { useContrast } from '@entur/layout';
import classNames from 'classnames';

import SettingsPanel from '../SettingsPanel';
import { useSettings } from '@providers/SettingsContext';

import logo from '../../../media/logo/logo.svg';
import logoDark from '../../../media/logo/logoDark.svg';

import './TopNavigation.scss';

const TopNavigation = () => {
  const { colorMode } = useSettings();
  const isContrast = useContrast();

  const isFrontpage =
    typeof window !== 'undefined' && window.location.pathname === '/';
  return (
    <nav
      className={classNames('top-navigation', {
        'top-navigation--frontpage eds-contrast': isFrontpage,
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
      <NavItem to="/kom-i-gang">Kom i gang</NavItem>
      <NavItem to="/identitet">Identitet</NavItem>
      <NavItem to="/komponenter">Komponenter</NavItem>
      <NavItem to="/tokens">Tokens</NavItem>
      <NavItem to="/universell-utforming">Universell utforming</NavItem>
      <SettingsPanel />
    </nav>
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

export default TopNavigation;

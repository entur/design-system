import React from 'react';
import { Link } from 'gatsby';
import { Location, useLocation } from '@reach/router';
import classNames from 'classnames';

import { Logo, TopNavigationItem } from '@entur/menu';

import SettingsPanel from '../SettingsPanel';
import { Search } from '@components/Search/Search';

import './TopNavigation.scss';

const TopNavigation = ({
  className,
  ...rest
}: React.ComponentPropsWithoutRef<'header'>) => {
  const location = useLocation();

  const isFrontpage = location.pathname === '/';

  return (
    <header
      className={classNames('top-navigation', className, {
        'top-navigation--frontpage eds-contrast': isFrontpage,
      })}
      {...rest}
    >
      <Logo as={Link} to="/" className="top-navigation__logo" />
      <nav aria-label="Navigasjon, hovedseksjoner">
        <NavItem to="/kom-i-gang">Kom i gang</NavItem>
        <NavItem to="/identitet">Identitet</NavItem>
        <NavItem to="/komponenter">Komponenter</NavItem>
        <NavItem to="/tokens">Tokens</NavItem>
        <NavItem to="/monster">Mønster</NavItem>
        <NavItem to="/ressurser">Ressurser</NavItem>
        <NavItem to="/universell-utforming">Universell utforming</NavItem>
      </nav>
      <Search />
      <SettingsPanel />
    </header>
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

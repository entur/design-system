import React from 'react';
import { Link } from 'gatsby';
import { Location, useLocation } from '@reach/router';
import classNames from 'classnames';

import { useContrast } from '@entur/layout';
import { TopNavigationItem } from '@entur/menu';

import SettingsPanel from '../SettingsPanel';
import { useSettings } from '@providers/SettingsContext';
import { Search } from '@components/Search/Search';

import logo from '@media/logo/logo.svg';
import logoDark from '@media/logo/logoDark.svg';

import './TopNavigation.scss';

const TopNavigation = ({
  className,
  ...rest
}: React.ComponentPropsWithoutRef<'header'>) => {
  const { colorMode } = useSettings();
  const isContrast = useContrast();
  const location = useLocation();

  const isFrontpage = location.pathname === '/';
  const shouldUseNegativeLogo =
    colorMode === 'dark' ||
    isContrast ||
    (colorMode === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);
  return (
    <header
      className={classNames('top-navigation', className, {
        'top-navigation--frontpage eds-contrast': isFrontpage,
      })}
      {...rest}
    >
      <Link to="/" className="top-navigation__logo">
        <img
          src={shouldUseNegativeLogo ? logoDark : logo}
          height="32px"
          width="102px"
          alt="Entur logo, klikk for å gå til startsiden"
        />
      </Link>
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

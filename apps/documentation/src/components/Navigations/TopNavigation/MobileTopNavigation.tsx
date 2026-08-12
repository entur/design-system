import React from 'react';
import { Link } from 'gatsby';
import classNames from 'classnames';
import { Location } from '@reach/router';

import { Logo } from '@entur/menu';

import SettingsPanel from '../SettingsPanel';
import { Search } from '@components/Search/Search';

import './MobileTopNav.scss';

type MobileTopNavigationProps = {
  frontPage?: boolean;
  className?: string;
  [key: string]: any;
};
const MobileTopNavigation: React.FC<MobileTopNavigationProps> = ({
  frontPage,
  className,
  ...rest
}) => {
  return (
    <nav
      className={classNames('mobile-topnav', className, {
        'eds-contrast':
          typeof window !== 'undefined' && window.location.pathname === '/',
      })}
      {...rest}
    >
      <div className="mobile-topnav__menu">
        <Logo as={Link} to="/" size="small" className="mobile-topnav__logo" />
        <Search />
        <SettingsPanel />
      </div>
      <div className="mobile-topnav__links mobile-topnav__links__scroll-gradient">
        <MobileTopNavItem to="/kom-i-gang">Kom i Gang</MobileTopNavItem>
        <MobileTopNavItem to="/identitet">Identitet</MobileTopNavItem>
        <MobileTopNavItem to="/komponenter">Komponenter</MobileTopNavItem>
        <MobileTopNavItem to="/tokens">Tokens</MobileTopNavItem>
        <MobileTopNavItem to="/monster">Mønster</MobileTopNavItem>
        <MobileTopNavItem to="/ressurser">Ressurser</MobileTopNavItem>
        <MobileTopNavItem to="/universell-utforming">
          Universell utforming
        </MobileTopNavItem>
      </div>
    </nav>
  );
};
export default MobileTopNavigation;

type MobileNavItemProps = {
  to: string;
  children: React.ReactNode;
  [key: string]: any;
};
const MobileTopNavItem: React.FC<MobileNavItemProps> = props => {
  return (
    <Location>
      {({ location }) => (
        <Link
          to={props.to}
          className={classNames('mobile-topnav-item', {
            'mobile-topnav-item--active':
              (location.pathname.startsWith(props.to) &&
                location.pathname.endsWith('/')) ||
              (location.pathname.startsWith(props.to) && props.to.length > 2),
          })}
        >
          {props.children}
        </Link>
      )}
    </Location>
  );
};

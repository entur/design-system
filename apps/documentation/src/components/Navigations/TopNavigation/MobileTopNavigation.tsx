import React from 'react';
import { Link } from 'gatsby';
import classNames from 'classnames';
import { Location } from '@reach/router';

import { Contrast, useContrast } from '@entur/layout';

import SettingsPanel from '../SettingsPanel';
import { useSettings } from '@providers/SettingsContext';
import { Search } from '@components/Search/Search';

import logo from '../../../media/logo/logo.svg';
import logoDark from '../../../media/logo/logoDark.svg';

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
  const { colorMode } = useSettings();
  const isContrast = useContrast();

  const Element = frontPage ? Contrast : 'div';

  return (
    <nav
      className={classNames('mobile-topnav', {
        'eds-contrast':
          typeof window !== 'undefined' && window.location.pathname === '/',
      })}
    >
      <div className="mobile-topnav__menu">
        <Link to="/" className="mobile-topnav__logo">
          <img
            src={colorMode === 'dark' || isContrast ? logoDark : logo}
            alt="Entur logo – designsystemets starside"
          />
        </Link>
        <Search />
        <SettingsPanel />
      </div>
      <div className="mobile-topnav__links mobile-topnav__links__scroll-gradient">
        <MobileTopNavItem to="/kom-i-gang">Kom i Gang</MobileTopNavItem>
        <MobileTopNavItem to="/identitet">Identitet</MobileTopNavItem>
        <MobileTopNavItem to="/komponenter">Komponenter</MobileTopNavItem>
        <MobileTopNavItem to="/tokens">Tokens</MobileTopNavItem>
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

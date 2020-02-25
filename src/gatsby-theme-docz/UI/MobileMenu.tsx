import React from 'react';
import { Link } from 'docz';
import { Location } from '@reach/router';
import { Contrast } from '@entur/layout/src';
import { MenuIcon } from '@entur/icons';
import classNames from 'classnames';
import logo from '~/components/logo.svg';
import logoDark from '~/components/logoDark.svg';
import './MobileMenu.scss';
import SettingsPanel from '~/components/SettingsPanel';
import { SiteSidebar } from '~/components/SiteSidebar';

type MobileMenuProps = {
  frontPage?: boolean;
  className?: string;
  [key: string]: any;
};
const MobileMenu: React.FC<MobileMenuProps> = ({
  frontPage,
  className,
  ...rest
}) => {
  const [sidemenu, showSidemenu] = React.useState(false);
  const Element = frontPage ? Contrast : 'div';
  return (
    <Element as="header" className={className}>
      <div className="mobile-nav-bar__menu">
        <button
          className="mobile-nav-bar__menu--menu"
          onClick={() => {
            showSidemenu(!sidemenu);
            rest.openMenu(!sidemenu);
          }}
          type="button"
        >
          <MenuIcon />
        </button>
        {frontPage ? (
          <img src={logo} alt="Entur logo" />
        ) : (
          <img src={logoDark} alt="Entur logo" />
        )}
        <SettingsPanel />
      </div>
      <div className="mobile-nav-bar__links">
        <MobileNavItem to="/">Hjem</MobileNavItem>
        <MobileNavItem to="/kom-i-gang">Kom i Gang</MobileNavItem>
        <MobileNavItem to="/design-prinsipper">Designprinsipper</MobileNavItem>
        <MobileNavItem to="/visuell-identitet">Visuell identitet</MobileNavItem>
        <MobileNavItem to="/komponenter">Komponenter</MobileNavItem>
      </div>
      <SiteSidebar
        className={classNames('sidebar-mobile', {
          'sidebar-mobile--show': sidemenu,
        })}
        mobile
      />
    </Element>
  );
};

type MobileNavItemProps = {
  to: string;
  children: React.ReactNode;
  [key: string]: any;
};
const MobileNavItem: React.FC<MobileNavItemProps> = props => {
  return (
    <Location>
      {({ location }) => (
        <Link
          to={props.to}
          className={classNames('mobile-nav-item', {
            'mobile-nav-item--active':
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

export default MobileMenu;

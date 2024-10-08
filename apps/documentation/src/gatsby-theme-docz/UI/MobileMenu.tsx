import React from 'react';
import { Link } from 'docz';
import classNames from 'classnames';
import { Location } from '@reach/router';

import { Contrast, useContrast } from '@entur/layout';
import { MenuIcon } from '@entur/icons';
import { FloatingButton } from '@entur/button';

import SettingsPanel from '~/components/SettingsPanel';
import { SiteSidebar } from '~/components/SiteSidebar';
import { useSettings } from '~/utils/Providers/SettingsContext';

import logo from '~/components/logo.svg';
import logoDark from '~/components/logoDark.svg';

import './MobileMenu.scss';

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
  const { colorMode } = useSettings();
  const isContrast = useContrast();
  const [sidemenu, showSidemenu] = React.useState(false);
  const Element = frontPage ? Contrast : 'div';

  return (
    <>
      <Element as="header" className={className}>
        <div
          className={classNames('mobile-nav-bar', {
            'mobile-nav-bar--open-sidemenu': sidemenu,
          })}
        >
          <div className="mobile-nav-bar__menu">
            <Link to="/">
              <img
                src={colorMode === 'dark' || isContrast ? logoDark : logo}
                alt="Entur logo – designsystemets starside"
                style={{ paddingLeft: '24px' }}
              />
            </Link>
            <SettingsPanel />
          </div>
          <div className="mobile-nav-bar__links mobile-nav-bar__links__scroll-gradient">
            <MobileNavItem to="/kom-i-gang">Kom i Gang</MobileNavItem>
            <MobileNavItem to="/identitet">Identitet</MobileNavItem>
            <MobileNavItem to="/komponenter">Komponenter</MobileNavItem>
            <MobileNavItem to="/tokens">Tokens</MobileNavItem>
            <MobileNavItem to="/universell-utforming">
              Universell utforming
            </MobileNavItem>
          </div>
        </div>
        {!frontPage && (
          <FloatingButton
            size="medium"
            className={classNames('mobile-nav-bar__menu--menu-button', {
              'mobile-nav-bar__menu--menu-button-open': sidemenu,
            })}
            onClick={() => {
              showSidemenu(true);
              rest.openMenu(true);
            }}
            type="button"
            aria-label="meny"
          >
            <MenuIcon />
          </FloatingButton>
        )}

        <SiteSidebar
          key={1}
          className={classNames('sidebar-mobile', {
            'sidebar-mobile--show': sidemenu,
          })}
          mobile
          sideMenu={sidemenu}
          closeMenu={() => {
            showSidemenu(false);
            rest.openMenu(false);
          }}
        />
      </Element>
    </>
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

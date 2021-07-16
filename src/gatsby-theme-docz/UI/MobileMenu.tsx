import React from 'react';
import { Link } from 'docz';
import { Location } from '@reach/router';
import { Contrast } from '@entur/layout/src';
import { MenuIcon } from '@entur/icons';
import { FloatingButton } from '@entur/button';
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
    <>
      <Element as="header" className={className}>
        <div
          className={classNames('mobile-nav-bar', {
            'mobile-nav-bar--not-frontpage': !frontPage,
            'mobile-nav-bar--open-sidemenu': sidemenu,
          })}
        >
          <div className="mobile-nav-bar__menu">
            {frontPage ? (
              <img
                src={logo}
                alt="Entur logo"
                style={{ paddingLeft: '24px' }}
              />
            ) : (
              <Link to="/">
                <img
                  src={logoDark}
                  alt="Entur logo"
                  style={{ paddingLeft: '24px' }}
                />
              </Link>
            )}
            <SettingsPanel />
          </div>
          <div className="mobile-nav-bar__links">
            <MobileNavItem to="/kom-i-gang">Kom i Gang</MobileNavItem>
            <MobileNavItem to="/identitet">Identitet</MobileNavItem>
            <MobileNavItem to="/komponenter">Komponenter</MobileNavItem>
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

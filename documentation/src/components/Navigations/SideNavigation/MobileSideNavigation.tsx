import React from 'react';
import { MenuItem } from './utils';
import { Link } from 'gatsby';
import { FloatingButton } from '@entur/button';
import { LeftArrowIcon, MenuIcon } from '@entur/icons';
import classNames from 'classnames';
import { Heading2 } from '@entur/typography';
import { space } from '@entur/tokens';
import { SiteSideNavigation } from './SiteSideNavigation';

import { useContrast } from '@entur/layout';
import { useSettings } from '../../../contexts/SettingsContext';

import './MobileSideNavigation.scss';
import './SideNavigation.scss';

type MobileMenuProps = {
  className?: string;
  menuItems: MenuItem[];
  openSidebar: boolean;
  setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

export const MobileSideNavigation: React.FC<MobileMenuProps> = ({
  className,
  menuItems,
  openSidebar,
  setOpenSidebar,
}) => {
  const { colorMode } = useSettings();
  const isContrast = useContrast();

  return (
    <>
      <div className="ui-menu--mobile">
        <FloatingButton
          size="medium"
          className={classNames('mobile-nav-bar__menu--menu-button ', {
            'mobile-nav-bar__menu--menu-button-open': openSidebar,
          })}
          onClick={() => setOpenSidebar(true)}
          type="button"
          aria-label="meny"
        >
          <MenuIcon />
        </FloatingButton>
      </div>

      {openSidebar && (
        <div
          onClick={() => setOpenSidebar(false)}
          className={classNames('site-sidebar__backdrop')}
        />
      )}

      {openSidebar && (
        <div className={classNames('site-sidebar-wrapper', className)}>
          <nav aria-label={`Navigasjon for seksjonen "parent"`}>
            <div className="site-sidebar__background">
              <Link
                to="/"
                className="top-navigation__logo"
                style={{
                  marginLeft: space.extraLarge,
                }}
              >
                <img
                  //TODO: Fix images
                  //src={colorMode === 'dark' || isContrast ? logoDark : logo}
                  height="20px"
                  width="64px"
                  alt="Entur logo"
                />
              </Link>
              <Heading2
                margin="none"
                style={{
                  marginLeft: space.extraLarge,
                  marginTop: space.extraLarge2,
                }}
              >
                parent
              </Heading2>

              <SiteSideNavigation
                menuItems={menuItems}
                mobile={true}
                openSidebar={openSidebar}
              />
            </div>

            <FloatingButton
              aria-label="Lukk sidemeny"
              onClick={() => setOpenSidebar(false)}
              className={classNames('site-sidebar__close-menu', {
                'site-sidebar__close-menu--open': openSidebar,
              })}
            >
              <LeftArrowIcon />
            </FloatingButton>
          </nav>
        </div>
      )}
    </>
  );
};

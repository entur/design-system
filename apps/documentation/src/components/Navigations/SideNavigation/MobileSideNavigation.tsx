import React, { useEffect } from 'react';
import { MenuItem, removeTrailingSlash } from './utils';
import { Link } from 'gatsby';
import { FloatingButton } from '@entur/button';
import { LeftArrowIcon, MenuIcon } from '@entur/icons';
import classNames from 'classnames';
import { Heading2 } from '@entur/typography';
import { space } from '@entur/tokens';
import { useLocation } from '@reach/router';
import SideNavigation from './SideNavigation';
import { useContrast } from '@entur/layout';
import { useSettings } from '@providers/SettingsContext';

import logo from '../../../media/logo/logo.svg';
import logoDark from '../../../media/logo/logoDark.svg';

import './MobileSideNavigation.scss';

type MobileMenuProps = {
  className?: string;
  menuItems: MenuItem[];
  openSidebar: boolean;
  setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

const MobileSideNavigation: React.FC<MobileMenuProps> = ({
  className,
  menuItems,
  openSidebar,
  setOpenSidebar,
}) => {
  const { colorMode } = useSettings();
  const isContrast = useContrast();

  const location = useLocation();
  const currentPathSegments = removeTrailingSlash(location.pathname).split('/');
  const parentPath =
    currentPathSegments.length > 1 ? currentPathSegments[1] : '';
  const capitalizedParentPath =
    parentPath.charAt(0).toUpperCase() + parentPath.slice(1);

  useEffect(() => {
    const siteContent = document.body;
    if (!siteContent) return;

    if (openSidebar) siteContent.style.overflow = 'hidden';
    else siteContent.style.overflow = '';
  }, [openSidebar]);

  useEffect(() => () => setOpenSidebar(false), [setOpenSidebar]);

  return (
    <>
      <FloatingButton
        size="medium"
        className={classNames('mobile-side-navigation__menu--menu-button', {
          'mobile-side-navigation__menu--menu-button-open': openSidebar,
        })}
        onClick={() => setOpenSidebar(true)}
        type="button"
        aria-label="meny"
      >
        <MenuIcon />
      </FloatingButton>

      {openSidebar && (
        <div
          onClick={() => setOpenSidebar(false)}
          className="mobile-side-navigation__backdrop"
        />
      )}
      <div
        className={classNames('mobile-side-navigation', {
          'mobile-side-navigation--visible': openSidebar,
        })}
      >
        <nav
          className={classNames('mobile-side-navigation-wrapper', className)}
          aria-label={`Navigasjon for seksjonen "${parentPath}"`}
        >
          <div className="mobile-side-navigation__background">
            <Link to="/" className="mobile-side-navigation__logo">
              <img
                src={colorMode === 'dark' || isContrast ? logoDark : logo}
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
              {capitalizedParentPath}
            </Heading2>

            <SideNavigation
              menuItems={menuItems}
              mobile={true}
              onClickMenuItem={() => setOpenSidebar(false)}
            />
          </div>

          <FloatingButton
            aria-label="Lukk sidemeny"
            onClick={() => setOpenSidebar(false)}
            className={classNames('mobile-side-navigation__close-menu', {
              'mobile-side-navigation__close-menu--open': openSidebar,
            })}
          >
            <LeftArrowIcon />
          </FloatingButton>
        </nav>
      </div>
    </>
  );
};

export default MobileSideNavigation;

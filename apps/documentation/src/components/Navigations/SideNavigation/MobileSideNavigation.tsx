import React, { useEffect } from 'react';

import { MenuItem } from './utils';
import { FloatingButton } from '@entur/button';
import { MenuIcon } from '@entur/icons';
import classNames from 'classnames';
import { Drawer } from '@entur/modal';

import SideNavigation from './SideNavigation';

import './SideNavigation.scss';

type MobileMenuProps = {
  className?: string;
  menuItems: MenuItem[];
  openSidebar: boolean;
  setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

const MobileSideNavigation: React.FC<MobileMenuProps> = ({
  menuItems,
  openSidebar,
  setOpenSidebar,
}) => {
  useEffect(() => {
    const siteContent = document.body;
    if (!siteContent) return;

    if (openSidebar) siteContent.style.overflow = 'hidden';
    else siteContent.style.overflow = '';
  }, [openSidebar]);

  useEffect(() => () => setOpenSidebar(false), [setOpenSidebar]);

  return (
    <>
      <Drawer
        open={openSidebar}
        onDismiss={() => setOpenSidebar(false)}
        title={''}
        className="side-navigation__drawer"
        overlay
      >
        <SideNavigation
          menuItems={menuItems}
          mobile={true}
          onClickMenuItem={() => setOpenSidebar(false)}
          className="side-navigation__drawer__wrapper"
        />
      </Drawer>
      <FloatingButton
        size="medium"
        className={classNames('side-navigation__drawer__menu-button', {
          'side-navigation__drawer__menu-button-open': openSidebar,
        })}
        onClick={() => setOpenSidebar(true)}
        type="button"
        aria-label="meny"
      >
        <MenuIcon />
      </FloatingButton>
    </>
  );
};

export default MobileSideNavigation;

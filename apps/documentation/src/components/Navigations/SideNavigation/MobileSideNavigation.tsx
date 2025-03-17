import React, { useEffect } from 'react';
import classNames from 'classnames';

import { MenuItem } from './utils';
import { Drawer } from '@entur/modal';
import { MenuIcon, CloseIcon } from '@entur/icons';
import { FloatingButton } from '@entur/button';
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
        className={classNames('side-navigation__drawer__menu-button')}
        onClick={() => setOpenSidebar(!openSidebar)}
        type="button"
        aria-label={openSidebar ? 'Lukk meny' : 'Åpne meny'}
      >
        {openSidebar ? (
          <CloseIcon aria-hidden="true" />
        ) : (
          <MenuIcon aria-hidden="true" />
        )}
      </FloatingButton>
    </>
  );
};

export default MobileSideNavigation;

import React from 'react';
import { SideNavigationProps } from './SideNavigation';
import { useControllableProp } from './useControllableProp';
import classNames from 'classnames';
import { LeftArrowIcon, MenuIcon } from '@entur/icons';

type CollapsibleSideNavigationProps = SideNavigationProps & {
  /**Tilstand til menyen
   * @default false
   */
  collapsed?: boolean;
  /** Kalles når menyen åpnes eller lukkes  */
  onCollapseToggle?: (e: any) => void;
  /** Posisjonen til Collapsible-knappen, målt fra toppen (som CSS-enhet)
   *  @default 50%
   */
  collapsibleButtonPosition?: string;
};

export const CollapsibleSideNavigation: React.FC<CollapsibleSideNavigationProps> = ({
  className,
  children,
  size,
  collapsed: collapsible,
  onCollapseToggle,
  collapsibleButtonPosition = '50%',
  ...rest
}) => {
  const [collapsedMenu, setCollapsedMenu] = useControllableProp({
    prop: collapsible,
    defaultValue: false,
    updater: onCollapseToggle,
  });

  const openCollapsedMenu = () => {
    setCollapsedMenu(false);
  };

  return (
    <SideNavigationContext.Provider
      value={{
        isCollapsed: collapsedMenu,
        openCollapsedMenu: () => openCollapsedMenu(),
      }}
    >
      <ul
        className={classNames(
          'eds-side-navigation',
          { 'eds-side-navigation--small': size === 'small' },
          { 'eds-side-navigation--collapsed': collapsedMenu },
          className,
        )}
        {...rest}
      >
        {children}
        <button
          className="eds-side-navigation__collapse-button"
          onClick={() => setCollapsedMenu(!collapsedMenu)}
          style={{ top: `${collapsibleButtonPosition}` }}
        >
          {collapsedMenu ? <MenuIcon /> : <LeftArrowIcon />}
        </button>
      </ul>
    </SideNavigationContext.Provider>
  );
};

const SideNavigationContext = React.createContext<{
  isCollapsed: boolean;
  openCollapsedMenu: () => void;
}>({
  isCollapsed: false,
  openCollapsedMenu: () => {},
});

export const useSideNavigationContext = () => {
  const context = React.useContext(SideNavigationContext);
  if (!context) {
    console.error(
      'Error reading SideNavigationContext. Please contact maintainer of @entur/menu',
    );
  }
  return context;
};

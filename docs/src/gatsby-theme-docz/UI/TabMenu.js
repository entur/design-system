import React, { useMemo } from 'react';
import { useMenus, Link } from 'docz';
import { Menu as EnturMenu } from '../entur/menu';
import { MenuItem } from '../entur/menu/MenuItem';
import logoSVG from './enturWhite.svg';
import './menu.scss';

export default function TabMenu(props) {
  const menus = useMenus();
  const currentMenu = useMemo(
    () =>
      menus.find(menu =>
        menu.menu.find(subMenu => subMenu.route === props.currentPath),
      ) || menus[0],
    [props.currentPath],
  );

  return (
    <>
      <nav className="navbar">
        <div className="logo-wrapper">
          <img src={logoSVG} alt="" />
        </div>
        <div className="tab-link-container">
          {menus
            .filter(menu => menu.menu)
            .map(menu => (
              <Link to={menu.menu[0].route} className="tab-link" key={menu.id}>
                {menu.name}
              </Link>
            ))}
        </div>
      </nav>
      <div className="sidemenu-wrapper">
        <SideMenu menu={currentMenu} />
      </div>
    </>
  );
}

function SideMenu({ menu }) {
  return (
    <EnturMenu>
      {menu.menu.map(subMenu => (
        <MenuItem
          label={<Link to={subMenu.route}>{subMenu.name}</Link>}
          id={subMenu.id}
          key={subMenu.id + subMenu.name}
        ></MenuItem>
      ))}
    </EnturMenu>
  );
}

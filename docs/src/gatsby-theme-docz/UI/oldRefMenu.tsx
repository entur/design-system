import React, { useMemo, useState, Fragment } from 'react';
import { useMenus, Link, useDocs } from 'docz';
// import { Menu as EnturMenu } from '../entur/menu';
// import { MenuItem } from '../entur/menu/MenuItem';
// import logoSVG from './enturWhite.svg';
import './menu.scss';

export const TOPBAR = [
  {
    id: 1,
    children: 'Home',
    to: '/',
  },
  {
    id: 2,
    children: 'Designprinsipper',
    to: '/principles/lederstjerne', //Hardcode to specific subpage, or make sure every menu has a  "/" route (startpage)??
  },
  {
    id: 3,
    children: 'Visuell Identitet',
    to: '/visual/colors',
  },
  {
    id: 4,
    children: 'Komponenter',
    to: '/components/button',
  },
];

const Menu = ({ doc, active, onClick }) => {
  return (
    <Link to={doc.route} onClick={onClick}>
      {doc.name}
    </Link>
  );
};

export default function TabMenu(props) {
  const menus = useMenus();
  const docs = useDocs();
  console.log(menus);
  const currentMenu = useMemo(
    () =>
      menus.find(menu =>
        menu.menu.find(subMenu => subMenu.route === props.currentPath),
      ) || menus[0],
    [props.currentPath, menus],
  );

  const isActive = ({ isCurrent }) => {
    return isCurrent ? { className: 'tab-link active-tab-link' } : null;
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo-wrapper">
          <img src={logoSVG} alt="" />
        </div>
        <div className="tab-link-container">
          {TOPBAR.map((menu, index) => (
            <Link
              // {...props}
              // getProps={isActive}
              to={menu.to}
              className="tab-link"
              key={index}
            >
              {menu.children}
            </Link>
          ))}
        </div>
      </nav>
      <div className="sidemenu-wrapper">
        {menus &&
          menus.map(({ id, name, menu }) => {
            if (!menu) return null;
            return (
              <React.Fragment key={id}>
                <div>{name}</div>
                {menu.map(item => {
                  const doc = docs && docs.find(doc => doc.name === item.name);
                  if (!doc) return null;
                  console.log(doc);
                  return (
                    <Menu
                      key={doc.id}
                      doc={doc}
                      // active={Boolean(pathname && pathname.includes(doc.route))}
                      // onClick={handleSidebarToggle}
                    />
                  );
                })}
              </React.Fragment>
            );
          })}
      </div>
    </>
  );
}

function SideMenu({ menu, currentPath }) {
  const [active, setActive] = useState(currentPath);
  return (
    <EnturMenu active={active} onItemSelected={setActive}>
      {menu.menu.map(subMenu => (
        <MenuItem
          label={<Link to={subMenu.route}>{subMenu.name}</Link>}
          id={subMenu.route}
          key={subMenu.id + subMenu.name}
        >
          {subMenu.menu && <SideMenu menu={subMenu.menu} />}
        </MenuItem>
      ))}
    </EnturMenu>
  );
}

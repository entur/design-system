import React, { Fragment, useState } from 'react';
import { useMenus, Link, useDocs, useCurrentDoc } from 'docz';
import './menu.scss';

const logoSVG = require('./enturWhite.svg');
export const TOPBAR = [
  {
    id: 1,
    children: 'Kom i gang',
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

function Sidebar({ menus, docs, parent }) {
  return (
    <Fragment>
      {menus &&
        menus.map(({ id, name, menu }) => {
          if (!menu) return null;
          if (menu[0].parent !== parent) return null;
          console.log(menu, name, parent);

          return (
            <React.Fragment key={id}>
              {menu[0].parent === parent && <div>{name}</div>}
              {menu.map(item => {
                const doc = docs && docs.find(doc => doc.name === item.name);
                if (!doc) return null;

                return (
                  <div>
                    <Link key={doc.id} to={doc.route}>
                      {doc.name}
                    </Link>
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}
    </Fragment>
  );
}

export default function Menu({ currentPath }) {
  const menus = useMenus();
  const currentDoc = useCurrentDoc();

  const docs = useDocs();

  const [currentTop, setTop] = useState(currentDoc.parent);

  return (
    <>
      <nav className="navbar">
        <div className="logo-wrapper">
          <img src={logoSVG} alt="" />
        </div>
        <div className="tab-link-container">
          {TOPBAR.map((menu, index) => (
            <Link
              to={menu.to}
              className="tab-link"
              key={index}
              onClick={() => setTop(menu.children)}
            >
              {menu.children}
            </Link>
          ))}
        </div>
      </nav>
      <Sidebar menus={menus} docs={docs} parent={currentTop} />
    </>
  );
}

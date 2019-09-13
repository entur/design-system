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

          return (
            <div key={id}>
              {menu[0].parent === parent && (
                <div className="sidemenu-group-header">{name}</div>
              )}
              {menu.map(item => {
                const doc = docs && docs.find(doc => doc.name === item.name);
                if (!doc) return null;

                return (
                  <Link key={doc.id} to={doc.route}>
                    <div className="sidemenu-link">{doc.name}</div>
                  </Link>
                );
              })}
            </div>
          );
        })}
    </Fragment>
  );
}

function HeadingNavigator({ currentDoc }) {
  return (
    <div className="heading-navigator-links-wrapper">
      {currentDoc.headings.map(heading => (
        <a
          className="heading-link"
          href={`#${heading.slug}`}
          key={heading.depth}
        >
          {heading.value}
        </a>
      ))}
    </div>
  );
}

export default function Menu() {
  const menus = useMenus();
  const currentDoc = useCurrentDoc();

  const docs = useDocs();

  const [currentTop, setTop] = useState(currentDoc.parent);
  console.log(currentDoc);
  return (
    <>
      <nav className="navbar">
        <div className="logo-wrapper">
          <img src={logoSVG} alt="Entur logo" className="logo-container" />
        </div>
        <div className="tab-link-container">
          {TOPBAR.map((menu, index) => (
            <Link
              to={menu.to}
              key={index}
              onClick={() => setTop(menu.children)}
            >
              <div className="tab-link">{menu.children}</div>
            </Link>
          ))}
        </div>
      </nav>
      <div className="sidemenu-wrapper">
        <Sidebar menus={menus} docs={docs} parent={currentTop} />
      </div>
      <div className="heading-navigator-wrapper">
        <HeadingNavigator currentDoc={currentDoc} />
      </div>
    </>
  );
}

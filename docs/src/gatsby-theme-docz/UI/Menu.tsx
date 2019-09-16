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
  if (!menus) {
    return null;
  }

  return (
    <Fragment>
      {menus
        .filter(({ menu }) => menu)
        .filter(({ menu }) => menu[0].parent === parent)
        .map(({ id, name, menu }) => {
          return (
            <ul key={id}>
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
            </ul>
          );
        })}
    </Fragment>
  );
}

function HeadingNavigator({ currentDoc }) {
  const headings = currentDoc ? currentDoc.headings : [''];
  return (
    <div className="heading-navigator-links-wrapper">
      {headings.map(heading => (
        <a
          className="heading-link"
          href={`#${heading.slug}`}
          key={heading.depth + heading.slug}
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

  const parent = currentDoc ? currentDoc.parent : 'Kom i gang';

  const docs = useDocs();

  const [currentTop, setTop] = useState(parent);
  return (
    <>
      <nav className="navbar">
        <div className="logo-wrapper">
          <img src={logoSVG} alt="Entur logo" className="logo-container" />
        </div>
        <div className="tab-link-container">
          <Link to={'/'} onClick={() => setTop('Kom i gang')}>
            <div className="tab-link">Kom i gang</div>
          </Link>
          <Link to={'/principles/'} onClick={() => setTop('Designprinsipper')}>
            <div className="tab-link">Designprinsipper</div>
          </Link>
          <Link to={'/visual/'} onClick={() => setTop('Visuell Identitet')}>
            <div className="tab-link">Visuell Identitet</div>
          </Link>
          <Link to={'/components/'} onClick={() => setTop('Komponenter')}>
            <div className="tab-link">Komponenter</div>
          </Link>
        </div>
      </nav>
      <nav className="sidemenu-wrapper">
        <Sidebar menus={menus} docs={docs} parent={currentTop} />
      </nav>
      <nav className="heading-navigator-wrapper">
        <HeadingNavigator currentDoc={currentDoc} />
      </nav>
    </>
  );
}

import React, { Fragment, useState } from 'react';
import { useMenus, Link, useDocs, useCurrentDoc } from 'docz';
import { Menu as EnturMenu, MenuItem } from '../entur/menu';
var classNames = require('classnames');
import './menu.scss';
const logoSVG = require('./enturWhite.svg');

function Sidebar({ menus, docs, parent, currentDoc }) {
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
                <li>
                  <div className="sidemenu-group-header">{name}</div>
                </li>
              )}
              <ul>
                {menu.map(item => {
                  const doc = docs && docs.find(doc => doc.name === item.name);
                  if (!doc) return null;

                  return (
                    <li key={doc.id}>
                      <Link to={doc.route}>
                        <div className="sidemenu-link">{doc.name}</div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
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
  const docs = useDocs();
  const [currentTop, setCurrentTop] = useState(currentDoc.parent);

  React.useEffect(() => {
    setCurrentTop(currentDoc ? currentDoc.parent : 'Kom i gang');
  }, [currentDoc]);

  return (
    <>
      <nav className="navbar">
        <div className="logo-wrapper">
          <img src={logoSVG} alt="Entur logo" className="logo-container" />
        </div>
        <div className="tab-link-container">
          <Link to={'/'}>
            <div
              className={classNames(
                'tab-link',
                currentTop === 'Kom i gang' ? 'active-tab-link' : '',
              )}
            >
              Kom i gang
            </div>
          </Link>
          <Link to={'/designprinsipper/'}>
            <div
              className={classNames(
                'tab-link',
                currentTop === 'Designprinsipper' ? 'active-tab-link' : '',
              )}
            >
              Designprinsipper
            </div>
          </Link>
          <Link to={'/visuellidentitet/'}>
            <div
              className={classNames(
                'tab-link',
                currentTop === 'Visuell Identitet' ? 'active-tab-link' : '',
              )}
            >
              Visuell Identitet
            </div>
          </Link>
          <Link to={'/komponenter/'}>
            <div
              className={classNames(
                'tab-link',
                currentTop === 'Komponenter' ? 'active-tab-link' : '',
              )}
            >
              Komponenter
            </div>
          </Link>
        </div>
      </nav>
      <nav className="sidemenu-wrapper">
        <input type="text"></input>
        <Sidebar
          menus={menus}
          docs={docs}
          parent={currentTop}
          currentDoc={currentDoc}
        />
      </nav>
      <nav className="heading-navigator-wrapper">
        <HeadingNavigator currentDoc={currentDoc} />
      </nav>
    </>
  );
}

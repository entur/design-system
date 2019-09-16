import React, { Fragment, useState } from 'react';
import { useMenus, Link, useDocs, useCurrentDoc } from 'docz';
import { Menu as EnturMenu } from '../entur/menu';
import { MenuItem } from '../entur/menu/MenuItem';
var classNames = require('classnames');
import './menu.scss';
const logoSVG = require('./enturWhite.svg');

function Sidebar({ menus, docs, currentParent, currentDoc }) {
  //CurrentDoc.fullpage can be used if one wants to hide sidebar on certain pages
  const startValue = menus.find(
    m =>
      m.name === currentDoc.name ||
      (m.menu && m.menu.find(n => n.name === currentDoc.name)),
  );
  const [currentSidemenu, setCurrentSidemenu] = useState(startValue.id);

  if (!menus) {
    return null;
  }
  return (
    <EnturMenu active={currentSidemenu}>
      {menus.map(({ id, name, menu, parent, route }) => {
        if (parent === currentParent) {
          return (
            <MenuItem
              id={id}
              key={id}
              label={<Link to={route}>{name}</Link>}
              onClick={() => setCurrentSidemenu(id)}
            />
          );
        } else if (menu && menu[0].parent === currentParent) {
          return (
            <MenuItem
              label={name}
              id={id}
              onClick={() => setCurrentSidemenu(id)}
            >
              <EnturMenu>
                {menu.map(nestedMenu => {
                  return (
                    <MenuItem
                      id={nestedMenu.ud}
                      key={nestedMenu.id}
                      label={
                        <Link to={nestedMenu.route}>{nestedMenu.name}</Link>
                      }
                      onClick={() => setCurrentSidemenu(nestedMenu.id)}
                    />
                  );
                })}
              </EnturMenu>
            </MenuItem>
          );
        }
      })}
    </EnturMenu>
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
        <input type="text" /> {/**Placeholder for search functionality */}
        <Sidebar
          menus={menus}
          docs={docs}
          currentParent={currentTop}
          currentDoc={currentDoc}
        />
      </nav>
      <nav className="heading-navigator-wrapper">
        <HeadingNavigator currentDoc={currentDoc} />
      </nav>
    </>
  );
}

import React from 'react';
import { Link } from 'docz';
import classNames from 'classnames';
import { TocNavigation } from '~/components/TocNavigation';
import { SiteSidebar } from '~/components/SiteSidebar';
import './Menu.scss';

const getLinkProps = ({ isPartiallyCurrent }: any) => ({
  className: classNames('tab-link', {
    'active-tab-link': isPartiallyCurrent,
  }),
});

export default function Menus() {
  return (
    <>
      <nav className="site-navbar">
        <div className="tab-link-container">
          <Link to="/kom-i-gang" getProps={getLinkProps}>
            Kom i gang
          </Link>
          <Link to="/design-prinsipper" getProps={getLinkProps}>
            Designprinsipper
          </Link>
          <Link to="/visuell-identitet" getProps={getLinkProps}>
            Visuell Identitet
          </Link>
          <Link to="/komponenter" getProps={getLinkProps}>
            Komponenter
          </Link>
        </div>
      </nav>
      <SiteSidebar />
      <nav className="heading-navigator-wrapper">
        <TocNavigation />
      </nav>
    </>
  );
}

import React from 'react';
import { Link } from 'docz';
import { TopNavigationItem } from '@entur/menu';
import LogoDark from '~/components/logoDark.svg';
import './FrontPageMenu.scss';

function FrontPageMenu() {
  return (
    <nav className="frontpage-menu-navbar">
      <Link to="/" className="frontpage--logo">
        <img src={LogoDark} alt="Entur logo" />
      </Link>
      <div className="frontpage-tab-link-container">
        <TopNavigationItem as={Link} to="/kom-i-gang">
          Kom i gang
        </TopNavigationItem>
        <TopNavigationItem as={Link} to="/design-prinsipper">
          Designprinsipper
        </TopNavigationItem>
        <TopNavigationItem as={Link} to="/visuell-identitet">
          Visuell Identitet
        </TopNavigationItem>
        <TopNavigationItem as={Link} to="/komponenter">
          Komponenter
        </TopNavigationItem>
      </div>
    </nav>
  );
}

export default FrontPageMenu;

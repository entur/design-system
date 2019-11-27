import React from 'react';
import { Link } from 'docz';
import { TopNavigationItem } from '@entur/menu';
import LogoDark from '~/components/logoDark.svg';
import './FrontPageMenu.scss';

function FrontPageMenu() {
  return (
    <header className="frontpage-header">
      <img src={LogoDark} alt="Entur logo" className="frontpage-header__logo" />
      <nav className="frontpage-header__navigation">
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
      </nav>
    </header>
  );
}

export default FrontPageMenu;

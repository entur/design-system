import React from 'react';
import { Link } from 'docz';
import { TopNavigationItem } from '@entur/menu';
import logo from '~/components/logo.svg';
import './FrontPageMenu.scss';
import { Contrast } from '@entur/layout/src';

function FrontPageMenu() {
  return (
    <Contrast as="header" className="frontpage-header">
      <span style={{ width: '26rem', alignSelf: 'flex-start' }}>
        <img src={logo} alt="Entur logo" className="frontpage-header__logo" />
      </span>
      <nav
        className="frontpage-header__navigation"
        aria-label="Navigasjon, hovedseksjoner"
      >
        <TopNavigationItem as={Link} to="/kom-i-gang">
          Kom i gang
        </TopNavigationItem>
        <TopNavigationItem as={Link} to="/design-prinsipper">
          Designprinsipper
        </TopNavigationItem>
        <TopNavigationItem as={Link} to="/visuell-identitet">
          Visuell identitet
        </TopNavigationItem>
        <TopNavigationItem as={Link} to="/komponenter">
          Komponenter
        </TopNavigationItem>
      </nav>
    </Contrast>
  );
}

export default FrontPageMenu;

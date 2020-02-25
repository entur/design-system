import React from 'react';
import classNames from 'classnames';
import { Link } from 'docz';
import { TopNavigationItem } from '@entur/menu';
import logo from '~/components/logo.svg';
import SettingsPanel from '~/components/SettingsPanel';
import { Contrast } from '@entur/layout/src';
import './FrontPageMenu.scss';

const FrontPageMenu: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <Contrast as="header" className={classNames('frontpage-header', className)}>
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
      <SettingsPanel />
    </Contrast>
  );
};

export default FrontPageMenu;

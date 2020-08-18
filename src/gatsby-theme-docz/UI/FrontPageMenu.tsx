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
      <span className="frontpage-header__logo">
        <img src={logo} height="32px" width="102px" alt="Entur logo" />
      </span>
      <nav
        className="frontpage-header__navigation"
        aria-label="Navigasjon, hovedseksjoner"
      >
        <TopNavigationItem as={Link} to="/kom-i-gang">
          Kom i gang
        </TopNavigationItem>
        <TopNavigationItem as={Link} to="/stil-og-tone">
          Stil og tone
        </TopNavigationItem>
        <TopNavigationItem as={Link} to="/visuell-identitet">
          Visuell identitet
        </TopNavigationItem>
        <TopNavigationItem as={Link} to="/komponenter">
          Komponenter
        </TopNavigationItem>
        <TopNavigationItem as={Link} to="/universell-utforming">
          Universell utforming
        </TopNavigationItem>
      </nav>
      <SettingsPanel />
    </Contrast>
  );
};

export default FrontPageMenu;
